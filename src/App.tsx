import { useEffect, useMemo, useState } from 'react'

import legacyHtml from '../legacy/rheon-onepage-v3.html?raw'
import { AdminPanel } from '@/admin/admin-panel'
import { applyLegacyContent } from '@/editor/apply-legacy-content'
import { buildContentSections, buildDefaultTextValues } from '@/editor/content-config'
import { fetchContentEntries } from '@/lib/content-api'

function isPanelHost(hostname: string) {
  return hostname === 'painel.localhost' || hostname.startsWith('painel.')
}

function App() {
  const searchParams = new URLSearchParams(window.location.search)
  const forcedAdminMode = searchParams.get('admin') === '1' || searchParams.get('editor') === '1'
  const adminFromHost = isPanelHost(window.location.hostname)
  const isAdminMode = forcedAdminMode || adminFromHost
  const contentSections = useMemo(() => buildContentSections(legacyHtml), [])
  const defaultValues = useMemo(() => buildDefaultTextValues(contentSections), [contentSections])

  const [entries, setEntries] = useState<Record<string, string>>(defaultValues)

  useEffect(() => {
    setEntries(defaultValues)
  }, [defaultValues])

  useEffect(() => {
    if (isAdminMode) return

    let ignore = false

    async function loadFromDb() {
      try {
        const remote = await fetchContentEntries()
        if (ignore) return
        setEntries((prev) => ({ ...prev, ...remote }))
      } catch {
        // Keep default content if API/database is unavailable.
      }
    }

    loadFromDb()
    const intervalId = window.setInterval(loadFromDb, 15000)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [isAdminMode])

  const siteHtml = useMemo(() => applyLegacyContent(legacyHtml, entries, contentSections), [contentSections, entries])

  if (isAdminMode) {
    return <AdminPanel legacyHtml={legacyHtml} />
  }

  return (
    <iframe
      title="Rheon Onepage Legacy"
      srcDoc={siteHtml}
      style={{ width: '100%', height: '100vh', border: '0', display: 'block' }}
    />
  )
}

export default App
