export type ContactEntry = {
  id: number
  name: string
  company: string
  email: string
  phone: string
  segment: string
  message: string
  status: string
  created_at: string
}

type ContactsApiResponse = {
  ok: boolean
  contacts?: ContactEntry[]
  message?: string
}

const CONTACTS_API_PATH = '/api/contacts'

export async function fetchContacts() {
  const response = await fetch(CONTACTS_API_PATH, {
    cache: 'no-store',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Falha ao buscar contatos (${response.status})`)
  }

  const data = (await response.json()) as ContactsApiResponse
  if (!data.ok) {
    throw new Error(data.message || 'Falha ao buscar contatos')
  }

  return data.contacts ?? []
}
