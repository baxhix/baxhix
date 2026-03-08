type AuthResponse = {
  ok: boolean
  authenticated?: boolean
  username?: string
  message?: string
}

const AUTH_SESSION_PATH = '/api/auth/session'
const AUTH_LOGIN_PATH = '/api/auth/login'
const AUTH_LOGOUT_PATH = '/api/auth/logout'

export async function getAuthSession() {
  const response = await fetch(AUTH_SESSION_PATH, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  })

  if (!response.ok) return { authenticated: false, username: '' }

  const data = (await response.json()) as AuthResponse
  return {
    authenticated: Boolean(data.ok && data.authenticated),
    username: data.username ?? '',
  }
}

export async function login(username: string, password: string) {
  const response = await fetch(AUTH_LOGIN_PATH, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = (await response.json().catch(() => ({ ok: false, message: 'Falha no login.' }))) as AuthResponse

  if (!response.ok || !data.ok) {
    throw new Error(data.message || `Falha no login (${response.status})`)
  }
}

export async function logout() {
  const response = await fetch(AUTH_LOGOUT_PATH, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Falha ao sair (${response.status})`)
  }
}
