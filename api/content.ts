import type { VercelRequest, VercelResponse } from '@vercel/node'

import { sql } from '@vercel/postgres'

import { getSessionFromCookie } from './_lib/auth'

type EntryMap = Record<string, string>

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS content_entries (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `
}

async function getEntries() {
  const result = await sql<{ key: string; value: string; updated_at: string }>`
    SELECT key, value, updated_at
    FROM content_entries
    ORDER BY key ASC;
  `

  const entries: EntryMap = {}
  let latestUpdatedAt = ''

  for (const row of result.rows) {
    entries[row.key] = row.value
    if (row.updated_at && row.updated_at > latestUpdatedAt) {
      latestUpdatedAt = row.updated_at
    }
  }

  return { entries, latestUpdatedAt }
}

async function upsertEntries(entries: EntryMap) {
  const payload = Object.entries(entries).filter(([key]) => key.trim().length > 0)

  for (const [key, value] of payload) {
    await sql`
      INSERT INTO content_entries (key, value, updated_at)
      VALUES (${key}, ${value}, NOW())
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `
  }
}

function getBody(req: VercelRequest): { entries?: EntryMap } {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as { entries?: EntryMap }
    } catch {
      return {}
    }
  }
  return req.body as { entries?: EntryMap }
}

function isAuthenticated(req: VercelRequest) {
  return Boolean(getSessionFromCookie(req.headers.host, req.headers.cookie))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureTable()

    if (req.method === 'GET') {
      const { entries, latestUpdatedAt } = await getEntries()
      return res.status(200).json({ ok: true, entries, updatedAt: latestUpdatedAt })
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ ok: false, message: 'Nao autorizado.' })
      }

      const data = getBody(req)
      if (!data.entries || typeof data.entries !== 'object') {
        return res.status(400).json({ ok: false, message: 'Payload invalido. Envie { entries: { key: value } }.' })
      }

      await upsertEntries(data.entries)
      const { entries, latestUpdatedAt } = await getEntries()
      return res.status(200).json({ ok: true, entries, updatedAt: latestUpdatedAt })
    }

    if (req.method === 'DELETE') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ ok: false, message: 'Nao autorizado.' })
      }

      const key = typeof req.query.key === 'string' ? req.query.key : ''

      if (key) {
        await sql`DELETE FROM content_entries WHERE key = ${key};`
      } else {
        await sql`DELETE FROM content_entries;`
      }

      const { entries, latestUpdatedAt } = await getEntries()
      return res.status(200).json({ ok: true, entries, updatedAt: latestUpdatedAt })
    }

    return res.status(405).json({ ok: false, message: 'Metodo nao permitido.' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado'
    return res.status(500).json({ ok: false, message })
  }
}
