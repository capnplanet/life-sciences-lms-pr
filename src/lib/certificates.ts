import type { Certification } from './types'

function escapeXml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}

export function buildCertificateSVG(cert: Certification, userName: string) {
  const width = 1100
  const height = 850
  const title = 'Certificate of Completion'
  const body = `This certifies that ${userName} has successfully completed the module ${cert.moduleName}.`
  const issued = new Date(cert.issuedDate).toLocaleDateString()
  const expires = new Date(cert.expiryDate).toLocaleDateString()
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="100%" stop-color="#93c5fd"/>
    </linearGradient>
  </defs>
  <rect x="20" y="20" width="${width-40}" height="${height-40}" rx="24" fill="#fff" stroke="url(#g)" stroke-width="6"/>
  <text x="50%" y="160" font-family="Georgia, serif" font-size="48" text-anchor="middle" fill="#0f172a">${escapeXml(title)}</text>
  <text x="50%" y="280" font-family="Georgia, serif" font-size="32" text-anchor="middle" fill="#111827">${escapeXml(userName)}</text>
  <text x="50%" y="330" font-family="Georgia, serif" font-size="18" text-anchor="middle" fill="#374151">${escapeXml(body)}</text>
  <text x="50%" y="380" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="#6b7280">Issued: ${escapeXml(issued)} • Expires: ${escapeXml(expires)}</text>
  <text x="50%" y="430" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="#6b7280">Verification Code: ${escapeXml(cert.verificationCode)}</text>
  <g transform="translate(200,520)">
    <rect width="700" height="160" rx="12" fill="#f1f5f9"/>
    <text x="350" y="70" font-family="Georgia, serif" font-size="20" text-anchor="middle" fill="#0f172a">${escapeXml(cert.moduleName)}</text>
    <text x="350" y="110" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#6b7280">LifeSci Academy • Broad Spectrum GXP LLC</text>
  </g>
  <g transform="translate(150,720)">
    <line x1="0" y1="0" x2="300" y2="0" stroke="#94a3b8" stroke-width="2"/>
    <text x="150" y="28" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#334155">Authorized Signatory</text>
  </g>
  <g transform="translate(650,720)">
    <line x1="0" y1="0" x2="300" y2="0" stroke="#94a3b8" stroke-width="2"/>
    <text x="150" y="28" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#334155">Learner</text>
  </g>
</svg>`
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
}

export function downloadCertificateSVG(cert: Certification, userName: string) {
  const blob = buildCertificateSVG(cert, userName)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${cert.moduleName.replace(/\W+/g, '_')}_certificate.svg`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
