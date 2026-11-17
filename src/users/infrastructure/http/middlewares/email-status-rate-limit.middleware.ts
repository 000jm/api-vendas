import { NextFunction, Request, Response } from 'express'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 30
const requests = new Map<string, { count: number; resetAt: number }>()

export function emailStatusRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const now = Date.now()
  const key = req.ip || req.socket.remoteAddress || 'unknown'
  let entry = requests.get(key)

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS }
  }

  entry.count += 1
  requests.set(key, entry)

  if (entry.count > MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000))
    res.status(429).json({ status: 429, message: 'Too many requests' })
    return
  }

  next()
}
