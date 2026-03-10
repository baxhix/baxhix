import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import cookieParser from 'cookie-parser'
import express from 'express'
import { Pool } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')

const app = express()
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

const SESSION_COOKIE = 'rheon_admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24

function getDbUrl() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
}

const dbUrl = getDbUrl()
if (!dbUrl) {
  console.error('POSTGRES_URL (ou DATABASE_URL) não configurado.')
  process.exit(1)
}

const pool = new Pool({ connectionString: dbUrl })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS content_entries (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_entries (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      segment TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'novo',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

function secureEqual(a, b) {
  const left = Buffer.from(a || '')
  const right = Buffer.from(b || '')
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function getAuthSecret() {
  const secret = process.env.CMS_AUTH_SECRET
  if (secret && secret.trim()) return secret
  return 'dev-secret-change-me'
}

function getAdminCredentials() {
  const username = process.env.CMS_ADMIN_USERNAME || 'admin'
  const password = process.env.CMS_ADMIN_PASSWORD || 'admin123'
  return { username, password }
}

function sign(payloadPart, secret) {
  return crypto.createHmac('sha256', secret).update(payloadPart).digest('base64url')
}

function createSessionToken(username) {
  const payload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }

  const payloadPart = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url')
  const signature = sign(payloadPart, getAuthSecret())
  return `${payloadPart}.${signature}`
}

function verifySessionToken(token) {
  if (!token || !token.includes('.')) return null
  const [payloadPart, signature] = token.split('.')
  if (!payloadPart || !signature) return null

  const expectedSignature = sign(payloadPart, getAuthSecret())
  if (!secureEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf-8'))
    if (!payload.username || !payload.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

function isAuthenticated(req) {
  const token = req.cookies?.[SESSION_COOKIE]
  return Boolean(verifySessionToken(token))
}

function normalizeContactPayload(body) {
  const payload = body && typeof body === 'object' ? body : {}

  return {
    name: String(payload.name ?? '').trim(),
    company: String(payload.company ?? '').trim(),
    email: String(payload.email ?? '').trim(),
    phone: String(payload.phone ?? '').trim(),
    segment: String(payload.segment ?? '').trim(),
    message: String(payload.message ?? '').trim(),
  }
}

function validateContactPayload(payload) {
  if (!payload.name || !payload.company || !payload.email || !payload.segment) {
    return 'Preencha nome, empresa, e-mail e segmento.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(payload.email)) {
    return 'Informe um e-mail válido.'
  }

  return ''
}

function formatSegment(segment) {
  const map = {
    farma: 'Farmacêutico / Drogaria',
    beleza: 'Beleza / Cosméticos',
    pet: 'Pet Shop',
    outro: 'Outro',
  }

  return map[segment] || segment
}

app.get('/api/auth/session', (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE]
  const session = verifySessionToken(token)

  if (!session) {
    return res.status(401).json({ ok: false, authenticated: false })
  }

  return res.status(200).json({
    ok: true,
    authenticated: true,
    username: session.username,
    expiresAt: session.exp,
  })
})

app.post('/api/auth/login', (req, res) => {
  const { username = '', password = '' } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Informe usuário e senha.' })
  }

  const credentials = getAdminCredentials()
  if (!secureEqual(username, credentials.username) || !secureEqual(password, credentials.password)) {
    return res.status(401).json({ ok: false, message: 'Credenciais inválidas.' })
  }

  const token = createSessionToken(username)
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
    path: '/',
  })

  return res.status(200).json({ ok: true })
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' })
  return res.status(200).json({ ok: true })
})

app.post('/api/contact', async (req, res) => {
  try {
    const payload = normalizeContactPayload(req.body)
    const errorMessage = validateContactPayload(payload)

    if (errorMessage) {
      return res.status(400).json({ ok: false, message: errorMessage })
    }

    await pool.query(
      `
        INSERT INTO contact_entries (name, company, email, phone, segment, message)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [payload.name, payload.company, payload.email, payload.phone, payload.segment, payload.message],
    )

    return res.status(200).json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao registrar contato.'
    return res.status(500).json({ ok: false, message })
  }
})

app.get('/api/contacts', async (req, res) => {
  if (!isAuthenticated(req)) return res.status(401).json({ ok: false, message: 'Não autorizado.' })

  try {
    const result = await pool.query(
      `
        SELECT id, name, company, email, phone, segment, message, status, created_at
        FROM contact_entries
        ORDER BY created_at DESC
      `,
    )

    return res.status(200).json({ ok: true, contacts: result.rows })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar contatos.'
    return res.status(500).json({ ok: false, message })
  }
})

app.get('/api/content', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT key, value, updated_at FROM content_entries ORDER BY key ASC',
    )

    const entries = {}
    let updatedAt = ''
    for (const row of result.rows) {
      entries[row.key] = row.value
      if (row.updated_at && row.updated_at > updatedAt) updatedAt = row.updated_at
    }

    return res.status(200).json({ ok: true, entries, updatedAt })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado'
    return res.status(500).json({ ok: false, message })
  }
})

app.put('/api/content', async (req, res) => {
  if (!isAuthenticated(req)) return res.status(401).json({ ok: false, message: 'Não autorizado.' })

  try {
    const entries = req.body?.entries
    if (!entries || typeof entries !== 'object') {
      return res.status(400).json({ ok: false, message: 'Payload inválido. Envie { entries: { key: value } }.' })
    }

    for (const [key, value] of Object.entries(entries)) {
      if (!key || typeof key !== 'string') continue
      await pool.query(
        `
          INSERT INTO content_entries (key, value, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (key)
          DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
        `,
        [key, String(value ?? '')],
      )
    }

    const result = await pool.query(
      'SELECT key, value, updated_at FROM content_entries ORDER BY key ASC',
    )

    const savedEntries = {}
    let updatedAt = ''
    for (const row of result.rows) {
      savedEntries[row.key] = row.value
      if (row.updated_at && row.updated_at > updatedAt) updatedAt = row.updated_at
    }

    return res.status(200).json({ ok: true, entries: savedEntries, updatedAt })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado'
    return res.status(500).json({ ok: false, message })
  }
})

app.delete('/api/content', async (req, res) => {
  if (!isAuthenticated(req)) return res.status(401).json({ ok: false, message: 'Não autorizado.' })

  try {
    const key = typeof req.query.key === 'string' ? req.query.key : ''
    if (key) {
      await pool.query('DELETE FROM content_entries WHERE key = $1', [key])
    } else {
      await pool.query('DELETE FROM content_entries')
    }

    const result = await pool.query(
      'SELECT key, value, updated_at FROM content_entries ORDER BY key ASC',
    )

    const entries = {}
    let updatedAt = ''
    for (const row of result.rows) {
      entries[row.key] = row.value
      if (row.updated_at && row.updated_at > updatedAt) updatedAt = row.updated_at
    }

    return res.status(200).json({ ok: true, entries, updatedAt })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado'
    return res.status(500).json({ ok: false, message })
  }
})

app.use(express.static(distDir))
app.use((_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

const port = Number(process.env.PORT || 3000)

await ensureTable()
app.listen(port, () => {
  console.log(`Servidor iniciado em http://0.0.0.0:${port}`)
})
