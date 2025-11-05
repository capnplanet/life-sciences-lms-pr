export interface ESignatureRequest {
  documentId: string
  signerId: string
  reason?: string
}

export interface ESignatureRecord {
  id: string
  documentId: string
  signerId: string
  signedAt: string
  signatureHash: string
}

// Placeholder API calls to be implemented on the backend
export async function requestSignature(req: ESignatureRequest): Promise<{ requestId: string }> {
  const res = await fetch('/api/esign/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  })
  return res.json()
}

export async function verifySignature(signatureId: string): Promise<ESignatureRecord | null> {
  const res = await fetch(`/api/esign/${signatureId}`)
  if (!res.ok) return null
  return res.json()
}
