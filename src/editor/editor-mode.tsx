import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { applyLegacyContent } from '@/editor/apply-legacy-content'
import { CONTENT_SECTIONS, DEFAULT_TEXT_VALUES } from '@/editor/content-config'
import { clearContentEntries, fetchContentEntries, saveContentEntries } from '@/lib/content-api'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const STORAGE_KEY = 'rheon.text.editor.v2'
const THEME_KEY = 'rheon.editor.theme'

function downloadJson(data: Record<string, string>) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'rheon-textos.json'
  a.click()
  URL.revokeObjectURL(url)
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
}

function getPublicSiteUrl() {
  const { protocol, hostname, port } = window.location
  const nextHostname = hostname.startsWith('painel.') ? hostname.replace(/^painel\./, '') : hostname
  const nextPort = port ? `:${port}` : ''
  return `${protocol}//${nextHostname}${nextPort}/`
}

export function EditorMode({ legacyHtml }: { legacyHtml: string }) {
  const importRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<Record<string, string>>(DEFAULT_TEXT_VALUES)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getStoredTheme())

  const previewHtml = useMemo(() => applyLegacyContent(legacyHtml, values), [legacyHtml, values])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    let ignore = false

    async function bootstrap() {
      try {
        const localRaw = localStorage.getItem(STORAGE_KEY)
        const localValues = localRaw ? (JSON.parse(localRaw) as Record<string, string>) : {}
        const remoteValues = await fetchContentEntries().catch(() => ({}))

        if (ignore) return

        const merged = {
          ...DEFAULT_TEXT_VALUES,
          ...remoteValues,
          ...localValues,
        }

        setValues(merged)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      } finally {
        if (!ignore) setIsLoaded(true)
      }
    }

    bootstrap()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !dirty) return

    const timer = window.setTimeout(async () => {
      try {
        setSaveStatus('saving')
        await saveContentEntries(values)
        setSaveStatus('saved')
        setDirty(false)
      } catch {
        setSaveStatus('error')
      }
    }, 700)

    return () => window.clearTimeout(timer)
  }, [dirty, isLoaded, values])

  function handleValueChange(id: string, value: string) {
    setValues((prev) => {
      const next = { ...prev, [id]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    setDirty(true)
    setSaveStatus('idle')
  }

  async function handleResetAll() {
    const confirmed = window.confirm('Resetar todos os textos para o padrao?')
    if (!confirmed) return

    setValues(DEFAULT_TEXT_VALUES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_VALUES))
    setDirty(false)

    try {
      setSaveStatus('saving')
      await clearContentEntries()
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Record<string, string>
        const next = { ...DEFAULT_TEXT_VALUES, ...parsed }
        setValues(next)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setDirty(true)
      } catch {
        alert('JSON invalido para importacao.')
      }
    }
    reader.readAsText(file)

    if (importRef.current) importRef.current.value = ''
  }

  return (
    <div className="h-screen bg-background text-foreground">
      <div className="grid h-full grid-cols-[430px_1fr]">
        <aside className="overflow-y-auto border-r border-border bg-card/40 p-4">
          <div className="mb-4">
            <h1 className="text-lg font-semibold">Painel de Conteudo</h1>
            <p className="text-xs text-muted-foreground">
              Ambiente paralelo para editar textos por secao. Salva no banco e atualiza o site em producao.
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}>
              UI {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => downloadJson(values)}>
              Exportar JSON
            </Button>
            <Button size="sm" variant="outline" onClick={() => importRef.current?.click()}>
              Importar JSON
            </Button>
            <Button size="sm" variant="outline" onClick={handleResetAll}>
              Resetar Tudo
            </Button>
            <a className="inline-flex" href={getPublicSiteUrl()} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline">
                Ver Site
              </Button>
            </a>
            <input ref={importRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </div>

          <div className="mb-3 rounded-md border border-border bg-background p-2 text-xs">
            {!isLoaded && <span>Carregando conteudo...</span>}
            {isLoaded && saveStatus === 'idle' && <span>Sem alteracoes pendentes.</span>}
            {saveStatus === 'saving' && <span>Salvando no banco...</span>}
            {saveStatus === 'saved' && <span className="text-emerald-500">Salvo e publicado.</span>}
            {saveStatus === 'error' && (
              <span className="text-red-500">Falha ao salvar no banco. Verifique a configuracao do banco na Vercel.</span>
            )}
          </div>

          <div className="space-y-3">
            {CONTENT_SECTIONS.map((section) => (
              <Card key={section.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.fields.map((field) => (
                    <label key={field.id} className="block">
                      <span className="mb-1 block text-xs text-muted-foreground">{field.label}</span>
                      <Textarea
                        rows={3}
                        value={values[field.id] ?? ''}
                        onChange={(event) => handleValueChange(field.id, event.target.value)}
                      />
                    </label>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>

        <main className="h-full bg-black">
          <iframe title="Preview Editavel" srcDoc={previewHtml} className="h-full w-full border-0" />
        </main>
      </div>
    </div>
  )
}
