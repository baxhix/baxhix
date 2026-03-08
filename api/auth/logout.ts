import type { VercelRequest, VercelResponse } from '@vercel/node'

import { buildClearSessionCookie } from '../_lib/auth'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Metodo nao permitido.' })
  }

  res.setHeader('Set-Cookie', buildClearSessionCookie(req.headers.host))
  return res.status(200).json({ ok: true })
}
