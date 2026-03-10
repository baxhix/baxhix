import type { VercelRequest, VercelResponse } from '@vercel/node'

import { sql } from '@vercel/postgres'

import { getSessionFromCookie } from './_lib/auth'

type ContactEntry = {
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

function isAuthenticated(req: VercelRequest) {
  return Boolean(getSessionFromCookie(req.headers.host, req.headers.cookie))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Metodo nao permitido.' })
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, message: 'Nao autorizado.' })
  }

  try {
    await ensureContactsTable()

    const result = await sql<ContactEntry>`
      SELECT id, name, company, email, phone, segment, message, status, created_at
      FROM contact_entries
      ORDER BY created_at DESC;
    `

    return res.status(200).json({ ok: true, contacts: result.rows })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar contatos.'
    return res.status(500).json({ ok: false, message })
  }
}
