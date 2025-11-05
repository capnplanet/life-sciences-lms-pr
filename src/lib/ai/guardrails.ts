import type { DraftContent, RegulatoryAuthority } from '@/lib/types'

const WHITELIST: Record<RegulatoryAuthority, string[]> = {
  FDA: ['fda.gov'],
  EMA: ['ema.europa.eu', 'europa.eu'],
  'Health Canada': ['canada.ca', 'hc-sc.gc.ca'],
  PMDA: ['pmda.go.jp'],
  MHRA: ['gov.uk', 'mhra.gov.uk'],
  CDSCO: ['cdsco.gov.in', 'nha.gov.in'],
  ICH: ['ich.org']
}

export interface GuardrailIssue {
  message: string
  severity: 'info' | 'warn' | 'error'
}

export interface GuardrailReport {
  ok: boolean
  blockApprove: boolean
  issues: GuardrailIssue[]
}

export function evaluateGuardrails(draft: DraftContent): GuardrailReport {
  const issues: GuardrailIssue[] = []
  const authority = draft.regulatoryTrigger.authority
  const url = draft.regulatoryTrigger.url
  const hosts = WHITELIST[authority] || []
  const isWhitelisted = hosts.some(h => url.includes(h))
  if (!isWhitelisted) {
    issues.push({ message: 'Source is not a recognized primary regulator domain', severity: 'error' })
  }
  // Final vs draft detection heuristics
  const doc = draft.regulatoryTrigger.document.toLowerCase()
  const looksDraft = /draft|consultation/.test(doc)
  if (looksDraft) {
    issues.push({ message: 'Document appears to be a draft/consultation. Ensure provisional treatment.', severity: 'warn' })
  }
  // Effective date sanity
  const effective = new Date(draft.regulatoryTrigger.effectiveDate)
  if (isNaN(effective.getTime())) {
    issues.push({ message: 'Missing or invalid effective date', severity: 'error' })
  }
  // Minimal length/content checks
  if (!draft.content || draft.content.length < 40) {
    issues.push({ message: 'Proposed content too short to be actionable', severity: 'warn' })
  }
  // Rationale present
  if (!draft.rationale || draft.rationale.length < 20) {
    issues.push({ message: 'Rationale is insufficient', severity: 'warn' })
  }
  // Basic alignment hint using moduleId domain cue
  const domainHints: Record<string, string[]> = {
    'mod-001': ['g c p', 'consent', 'investigator', 'i r b', 'i e c'],
    'mod-002': ['pharmacovigilance', 'signal', 'adverse', 'p v', 'meddra'],
    'mod-003': ['g m p', 'c a p a', 'deviation', 'batch', 'alcoa'],
    'mod-004': ['c t d', 'e c t d', 'submission', 'prime', 'breakthrough'],
    'mod-005': ['quality assurance', 'audit', 't m f', 'oversight']
  }
  const textBlob = [draft.content, draft.rationale, draft.regulatoryTrigger.document].join(' ').toLowerCase()
  const hints = domainHints[draft.moduleId] || []
  const matched = hints.filter(h => textBlob.includes(h))
  if (hints.length > 0 && matched.length < Math.ceil(hints.length * 0.3)) {
    issues.push({ message: 'Draft may not align with target module subject matter', severity: 'warn' })
  }
  const hasError = issues.some(i => i.severity === 'error')
  return { ok: !hasError, blockApprove: hasError, issues }
}
