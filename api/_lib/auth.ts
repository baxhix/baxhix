import { createHmac, timingSafeEqual } from 'node:crypto'

const SESSION_COOKIE = 'rheon_admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24

type SessionPayload = {
  username: string
  exp: number
}

type AdminCredentials = {
  username: string
  password: string
}

function isLocalhostHost(host = '') {
  const hostname = host.split(':')[0]
  return ['localhost', '127.0.0.1', '::1', 'painel.localhost'].includes(hostname)
}

function getSecret(host?: string) {
  const secret = process.env.CMS_AUTH_SECRET
  if (secret && secret.trim().length > 0) return secret
  if (isLocalhostHost(host)) return 'dev-secret-change-me'
  return ''
}

function sign(payloadPart: string, secret: string) {
  return createHmac('sha256', secret).update(payloadPart).digest('base64url')
}

function parseCookieHeader(cookieHeader: string | undefined) {
  if (!cookieHeader) return {}
  const pairs = cookieHeader.split(';')
  const output: Record<string, string> = {}

  for (const pair of pairs) {
    const [rawKey, ...rest] = pair.trim().split('=')
    if (!rawKey) continue
    output[rawKey] = rest.join('=')
  }

  return output
}

function secureEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function getAdminCredentials(host?: string): AdminCredentials | null {
  const username = process.env.CMS_ADMIN_USERNAME ?? process.env.ADMIN_USER
  const password = process.env.CMS_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD

  if (username && password) {
    return { username, password }
  }

  if (isLocalhostHost(host)) {
    return { username: 'admin', password: 'X9@qL!7v#R2$kZ8&fT3*Wp' }
  }

  return null
}

export function isValidAdminLogin(host: string | undefined, username: string, password: string) {
  const credentials = getAdminCredentials(host)
  if (!credentials) return false

  return secureEqual(username, credentials.username) && secureEqual(password, credentials.password)
}

export function createSessionToken(host: string | undefined, username: string) {
  const secret = getSecret(host)
  if (!secret) throw new Error('CMS_AUTH_SECRET nao configurado.')

  const payload: SessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }

  const payloadPart = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url')
  const signature = sign(payloadPart, secret)
  return `${payloadPart}.${signature}`
}

export function verifySessionToken(host: string | undefined, token: string) {
  const secret = getSecret(host)
  if (!secret || !token.includes('.')) return null

  const [payloadPart, signature] = token.split('.')
  if (!payloadPart || !signature) return null

  const expectedSignature = sign(payloadPart, secret)

  if (!secureEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf-8')) as SessionPayload
    if (!payload.username || !payload.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function getSessionFromCookie(host: string | undefined, cookieHeader: string | undefined) {
  const cookies = parseCookieHeader(cookieHeader)
  const token = cookies[SESSION_COOKIE]
  if (!token) return null
  return verifySessionToken(host, token)
}

export function buildSessionCookie(host: string | undefined, token: string) {
  const secure = !isLocalhostHost(host)

  return [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export function buildClearSessionCookie(host: string | undefined) {
  const secure = !isLocalhostHost(host)

  return [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}
