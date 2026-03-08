import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { LayoutGrid, Palette, Tags, Users, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { buildContentSections, buildDefaultTextValues } from '@/editor/content-config'
import { getAuthSession, login, logout } from '@/lib/auth-api'
import { fetchContentEntries, saveContentEntries } from '@/lib/content-api'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type PanelModule = 'content' | 'visual' | 'performance' | 'users'

const THEME_KEY = 'rheon.admin.theme'
const SIDEBAR_KEY = 'rheon.admin.sidebar.collapsed'

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
}

function getPublicSiteUrl() {
  const { protocol, hostname, port } = window.location
  const nextHostname = hostname.startsWith('painel.') ? hostname.replace(/^painel\./, '') : hostname
  const nextPort = port ? `:${port}` : ''
  return `${protocol}//${nextHostname}${nextPort}/`
}

function isButtonField(field: { id: string; label: string }) {
  return /bot[aã]o|cta|button/i.test(`${field.id} ${field.label}`)
}

function buildFieldGroups(fields: Array<{ id: string; label: string; kind?: 'line' | 'area' }>) {
  const groupedMap = new Map<string, { title: string; fields: typeof fields }>()
  const singles: typeof fields = []

  for (const field of fields) {
    const layerMatch = field.id.match(/^layer_(\d+)_/)
    if (layerMatch) {
      const key = `layer_${layerMatch[1]}`
      if (!groupedMap.has(key)) {
        groupedMap.set(key, { title: `Camada ${layerMatch[1]}`, fields: [] })
      }
      groupedMap.get(key)!.fields.push(field)
      continue
    }

    const caseMatch = field.id.match(/^case_(\d+)_/)
    if (caseMatch) {
      const key = `case_${caseMatch[1]}`
      if (!groupedMap.has(key)) {
        groupedMap.set(key, { title: `Case ${caseMatch[1]}`, fields: [] })
      }
      groupedMap.get(key)!.fields.push(field)
      continue
    }

    const frameworkMatch = field.id.match(/^framework_(\d+)_/)
    if (frameworkMatch) {
      const key = `framework_${frameworkMatch[1]}`
      if (!groupedMap.has(key)) {
        groupedMap.set(key, { title: `Card ${frameworkMatch[1]}`, fields: [] })
      }
      groupedMap.get(key)!.fields.push(field)
      continue
    }

    singles.push(field)
  }

  const grouped = [...groupedMap.values()].map((group) => ({
    ...group,
    fields: group.fields.sort((a, b) => {
      const aTitle = /_title$|_headline$/.test(a.id) ? 0 : 1
      const bTitle = /_title$|_headline$/.test(b.id) ? 0 : 1
      return aTitle - bTitle
    }),
  }))

  return { singles, grouped }
}

export function AdminPanel({ legacyHtml }: { legacyHtml: string }) {
  const [activeModule] = useState<PanelModule>('content')
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getStoredTheme())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === '1')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentUser, setCurrentUser] = useState('')

  const contentSections = useMemo(() => buildContentSections(legacyHtml), [legacyHtml])
  const defaultValues = useMemo(() => buildDefaultTextValues(contentSections), [contentSections])
  const [values, setValues] = useState<Record<string, string>>(defaultValues)
  const [isLoaded, setIsLoaded] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    setValues(defaultValues)
  }, [defaultValues])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, isSidebarCollapsed ? '1' : '0')
  }, [isSidebarCollapsed])

  useEffect(() => {
    let ignore = false

    async function bootstrap() {
      try {
        const session = await getAuthSession()
        if (ignore) return

        if (!session.authenticated) {
          setIsAuthenticated(false)
          return
        }

        setIsAuthenticated(true)
        setCurrentUser(session.username)

        const remoteValues = await fetchContentEntries().catch(() => ({}))
        if (ignore) return

        setValues({ ...defaultValues, ...remoteValues })
        setIsLoaded(true)
      } finally {
        if (!ignore) setCheckingAuth(false)
      }
    }

    bootstrap()

    return () => {
      ignore = true
    }
  }, [defaultValues])

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    setLoginError('')

    try {
      await login(username, password)
      const session = await getAuthSession()
      setIsAuthenticated(session.authenticated)
      setCurrentUser(session.username)
      setPassword('')

      const remoteValues = await fetchContentEntries().catch(() => ({}))
      setValues({ ...defaultValues, ...remoteValues })
      setIsLoaded(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao autenticar.'
      setLoginError(message)
    }
  }

  async function handleLogout() {
    try {
      await logout()
    } finally {
      setIsAuthenticated(false)
      setCurrentUser('')
      setIsLoaded(false)
      setSaveStatus('idle')
      setValues(defaultValues)
    }
  }

  function handleValueChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }))
    setSaveStatus('idle')
  }

  async function handleSave() {
    try {
      setSaveStatus('saving')
      await saveContentEntries(values)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Verificando sessão...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Painel Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleLogin}>
              <label className="block text-sm">
                Usuário
                <Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
              </label>
              <label className="block text-sm">
                Senha
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </label>
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              Em localhost, padrão inicial: admin / admin123 (altere no deploy).
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const modules: Array<{ id: PanelModule; label: string; enabled: boolean; icon: typeof LayoutGrid }> = [
    { id: 'content', label: 'Conteúdo', enabled: true, icon: LayoutGrid },
    { id: 'visual', label: 'Identidade Visual', enabled: false, icon: Palette },
    { id: 'performance', label: 'Tags de Performance', enabled: false, icon: Tags },
    { id: 'users', label: 'Usuários', enabled: false, icon: Users },
  ]
  const selectedSection = contentSections.find((section) => section.id === selectedSectionId) ?? null
  const selectedSectionGroups = selectedSection ? buildFieldGroups(selectedSection.fields) : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-20 border-r border-border bg-card transition-[width] duration-200 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="flex h-16 items-center border-b border-border px-3">
          {!isSidebarCollapsed && <p className="text-sm font-semibold">Painel</p>}
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto h-10 rounded-[3px]"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-label={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-1 p-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = module.id === activeModule
            const isDisabled = !module.enabled

            return (
              <button
                key={module.id}
                type="button"
                disabled={isDisabled}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${
                  isActive ? 'bg-primary text-primary-foreground' : ''
                } ${isDisabled ? 'cursor-not-allowed text-muted-foreground opacity-60' : 'text-foreground'}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isSidebarCollapsed && <span>{module.label}</span>}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className={`min-h-screen transition-[margin] duration-200 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
            <div className="mr-auto">
              <h1 className="text-2xl font-semibold">Gestor de Conteúdo</h1>
              <p className="text-xs text-muted-foreground">
                Edição por seções com persistência em banco e publicação no site.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Usuário: {currentUser}</p>
            <Button
              size="sm"
              variant="outline"
              className="h-10 rounded-[3px]"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            >
              UI {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <a href={getPublicSiteUrl()} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline" className="h-10 rounded-[3px]">
                Abrir Site
              </Button>
            </a>
            <Button size="sm" variant="outline" className="h-10 rounded-[3px]" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-5">
          <div className="text-sm text-muted-foreground">
            {!selectedSection && <span>Conteúdo</span>}
            {selectedSection && (
              <span>
                Conteúdo / <span className="text-foreground">{selectedSection.title}</span>
              </span>
            )}
          </div>

          {!selectedSection && (
            <div className="space-y-3">
              {contentSections.map((section) => (
                <Card key={section.id}>
                  <CardContent className="flex items-center justify-between gap-4 py-5">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <Button size="sm" className="h-10 rounded-[3px]" onClick={() => setSelectedSectionId(section.id)}>
                      Editar seção
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedSection && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-2xl">{selectedSection.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-10 rounded-[3px]" onClick={() => setSelectedSectionId(null)}>
                      Voltar para seções
                    </Button>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  {saveStatus === 'idle' && 'Edite os campos e clique em salvar.'}
                  {saveStatus === 'saved' && 'Salvo com sucesso e publicado.'}
                  {saveStatus === 'error' && 'Falha ao salvar. Confira autenticação e banco.'}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedSectionGroups?.singles.map((field) => (
                  <label key={field.id} className="block">
                    <span className="mb-1 block text-sm text-muted-foreground">{field.label}</span>
                    {field.kind === 'line' || isButtonField(field) ? (
                      <Input
                        value={values[field.id] ?? ''}
                        onChange={(event) => handleValueChange(field.id, event.target.value)}
                        className={`h-10 rounded-[3px] ${isButtonField(field) ? 'w-full md:w-1/3' : 'w-full'}`}
                      />
                    ) : (
                      <Textarea
                        rows={3}
                        value={values[field.id] ?? ''}
                        onChange={(event) => handleValueChange(field.id, event.target.value)}
                      />
                    )}
                  </label>
                ))}

                {selectedSectionGroups?.grouped.map((group, index) => (
                  <div key={group.title} className="space-y-3">
                    {index > 0 && <div className="border-t border-border pt-3" />}
                    <h3 className="text-[18px] font-semibold">{group.title}</h3>
                    {group.fields.map((field) => (
                      <label key={field.id} className="block">
                        <span className="mb-1 block text-sm text-muted-foreground">
                          {/(_title$|_headline$)/.test(field.id) ? 'Título:' : 'Descrição:'}
                        </span>
                        {field.kind === 'line' || /(_title$|_headline$)/.test(field.id) ? (
                          <Input
                            value={values[field.id] ?? ''}
                            onChange={(event) => handleValueChange(field.id, event.target.value)}
                            className="h-10 w-full rounded-[3px]"
                          />
                        ) : (
                          <Textarea
                            rows={3}
                            value={values[field.id] ?? ''}
                            onChange={(event) => handleValueChange(field.id, event.target.value)}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    size="sm"
                    className="h-12 rounded-[3px] px-8 text-base"
                    onClick={handleSave}
                    disabled={!isLoaded || saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
