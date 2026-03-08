import type { VercelRequest, VercelResponse } from '@vercel/node'

import { buildSessionCookie, createSessionToken, getAdminCredentials, isValidAdminLogin } from '../_lib/auth'

type LoginBody = {
  username?: string
  password?: string
}

function getBody(req: VercelRequest): LoginBody {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as LoginBody
    } catch {
      return {}
    }
  }
  return req.body as LoginBody
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, message: 'Metodo nao permitido.' })
    }

    const host = req.headers.host
    const credentials = getAdminCredentials(host)
    if (!credentials) {
      return res.status(500).json({ ok: false, message: 'Configure CMS_ADMIN_USERNAME e CMS_ADMIN_PASSWORD na Vercel.' })
    }

    const data = getBody(req)
    if (!data.username || !data.password) {
      return res.status(400).json({ ok: false, message: 'Informe usuario e senha.' })
    }

    if (!isValidAdminLogin(host, data.username, data.password)) {
      return res.status(401).json({ ok: false, message: 'Credenciais invalidas.' })
    }

    const token = createSessionToken(host, data.username)
    const sessionCookie = buildSessionCookie(host, token)

    res.setHeader('Set-Cookie', sessionCookie)
    return res.status(200).json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado no login.'
    return res.status(500).json({ ok: false, message })
  }
}
