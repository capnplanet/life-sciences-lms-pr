import type { AuditLogEntry } from './types'

// Simple, tamper-evident hash chain using Web Crypto when available; falls back to DJB2
async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const enc = new TextEncoder()
    const data = enc.encode(message)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback (non-cryptographic)
  let hash = 5381
  for (let i = 0; i < message.length; i++) {
    hash = ((hash << 5) + hash) + message.charCodeAt(i)
    hash = hash & 0xffffffff
  }
  return ('00000000' + (hash >>> 0).toString(16)).slice(-8)
}

export async function buildAuditEntry(
  partial: Omit<AuditLogEntry, 'id' | 'timestamp' | 'hash'>,
  previous?: AuditLogEntry
): Promise<AuditLogEntry> {
  const id = `audit-${Math.random().toString(36).slice(2, 8)}`
  const timestamp = new Date().toISOString()
  const prevHash = previous?.hash
  const payload = { ...partial, id, timestamp, prevHash }
  const hash = await sha256(JSON.stringify(payload))
  return { ...payload, hash }
}

export function exportAuditJSON(entries: AuditLogEntry[]): Blob {
  return new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
}

export function exportAuditCSV(entries: AuditLogEntry[]): Blob {
  const headers = ['id','timestamp','userId','userName','actorRole','origin','action','resource','resourceId','ipAddress','userAgent','prevHash','hash','details']
  const rows = entries.map(e => [
    e.id,
    e.timestamp,
    e.userId,
    e.userName,
    e.actorRole || '',
    e.origin || '',
    e.action,
    e.resource,
    e.resourceId,
    e.ipAddress || '',
    e.userAgent || '',
    e.prevHash || '',
    e.hash || '',
    JSON.stringify(e.details || {})
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  return new Blob([csv], { type: 'text/csv' })
}
