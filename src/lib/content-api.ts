export type ContentEntries = Record<string, string>

type ContentApiResponse = {
  ok: boolean
  entries?: ContentEntries
  updatedAt?: string
  message?: string
}

const CONTENT_API_PATH = '/api/content'

export async function fetchContentEntries(): Promise<ContentEntries> {
  const response = await fetch(CONTENT_API_PATH, { cache: 'no-store', credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Falha ao buscar conteudo (${response.status})`)
  }

  const data = (await response.json()) as ContentApiResponse
  if (!data.ok || !data.entries) return {}
  return data.entries
}

export async function saveContentEntries(entries: ContentEntries) {
  const response = await fetch(CONTENT_API_PATH, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ entries }),
  })

  if (!response.ok) {
    throw new Error(`Falha ao salvar conteudo (${response.status})`)
  }

  const data = (await response.json()) as ContentApiResponse
  if (!data.ok) {
    throw new Error(data.message || 'Falha ao salvar conteudo')
  }

  return data.entries ?? {}
}

export async function clearContentEntries() {
  const response = await fetch(CONTENT_API_PATH, { method: 'DELETE', credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Falha ao limpar conteudo (${response.status})`)
  }
}
