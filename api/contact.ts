import type { VercelRequest, VercelResponse } from '@vercel/node'

import { sql } from '@vercel/postgres'

function getBody(req: VercelRequest) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }

  return req.body
}

function normalizeContactPayload(body: unknown) {
  const payload = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>

  return {
    name: String(payload.name ?? '').trim(),
    company: String(payload.company ?? '').trim(),
    email: String(payload.email ?? '').trim(),
    phone: String(payload.phone ?? '').trim(),
    segment: String(payload.segment ?? '').trim(),
    message: String(payload.message ?? '').trim(),
  }
}

function validateContactPayload(payload: ReturnType<typeof normalizeContactPayload>) {
  if (!payload.name || !payload.company || !payload.email || !payload.segment) {
    return 'Preencha nome, empresa, e-mail e segmento.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(payload.email)) {
    return 'Informe um e-mail válido.'
  }

  return ''
}

async function ensureContactsTable() {
  await sql`
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
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Metodo nao permitido.' })
  }

  try {
    await ensureContactsTable()
    const payload = normalizeContactPayload(getBody(req))
    const errorMessage = validateContactPayload(payload)

    if (errorMessage) {
      return res.status(400).json({ ok: false, message: errorMessage })
    }

    await sql`
      INSERT INTO contact_entries (name, company, email, phone, segment, message)
      VALUES (
        ${payload.name},
        ${payload.company},
        ${payload.email},
        ${payload.phone},
        ${payload.segment},
        ${payload.message}
      );
    `

    return res.status(200).json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao registrar contato.'
    return res.status(500).json({ ok: false, message })
  }
}
