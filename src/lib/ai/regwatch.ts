import type { DraftContent, RegulatoryReference } from '@/lib/types'

// Simulated regulatory updates from primary sources; in production, fetch from backend
const MOCK_UPDATES: RegulatoryReference[] = [
  {
    authority: 'FDA',
    document: 'Data Integrity and Compliance with Drug CGMP — Update 2025',
    section: 'Guidance',
    effectiveDate: new Date().toISOString(),
    url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/data-integrity-and-compliance-drug-cgmp'
  },
  {
    authority: 'ICH',
    document: 'E6(R3) Good Clinical Practice — Draft for Consultation',
    section: 'Concept Paper',
    effectiveDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    url: 'https://www.ich.org/page/efficacy-guidelines'
  },
  {
    authority: 'EMA',
    document: 'GVP Module IX — Signal Management Amendment 2025',
    section: 'Module IX',
    effectiveDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    url: 'https://www.ema.europa.eu/en/human-regulatory/post-authorisation/pharmacovigilance'
  }
]

export function proposeDraftFromReference(moduleId: string, ref: RegulatoryReference): DraftContent {
  const id = `draft-${Math.random().toString(36).slice(2, 8)}`
  const changeType: DraftContent['changeType'] = 'update'
  const status: DraftContent['status'] = 'pending-review'
  const content = `Incorporate latest ${ref.authority} update: ${ref.document} (${ref.section}). Align training with clarified expectations and emphasize impacted controls.`
  const rationale = `Detected regulatory update from ${ref.authority}: ${ref.document}. Content should be updated to reflect current expectations.`
  return {
    id,
    moduleId,
    changeType,
    content,
    rationale,
    regulatoryTrigger: ref,
    status,
    generatedAt: new Date().toISOString(),
    comments: []
  }
}

// Simple periodic proposal generator; caller owns integration into state
export function startRegwatchPolling(
  modules: { id: string; domain: string }[],
  onProposed: (draft: DraftContent) => void,
  intervalMs = 30000
) {
  const timer = setInterval(() => {
    const ref = MOCK_UPDATES[Math.floor(Math.random() * MOCK_UPDATES.length)]
    // naive routing: pick a module by authority/domain mapping
    const map: Record<string, string[]> = {
      'FDA': ['gmp', 'quality-assurance'],
      'EMA': ['pharmacovigilance'],
      'ICH': ['gcp', 'regulatory-affairs']
    }
    const targets = map[ref.authority] || []
    const candidates = modules.filter(m => targets.includes(m.domain))
    const target = candidates[0] || modules[0]
    onProposed(proposeDraftFromReference(target.id, ref))
  }, intervalMs)
  return () => clearInterval(timer)
}
