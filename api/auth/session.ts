import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getSessionFromCookie } from '../_lib/auth'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Metodo nao permitido.' })
  }

  const session = getSessionFromCookie(req.headers.host, req.headers.cookie)
  if (!session) {
    return res.status(401).json({ ok: false, authenticated: false })
  }

  return res.status(200).json({
    ok: true,
    authenticated: true,
    username: session.username,
    expiresAt: session.exp,
  })
}
