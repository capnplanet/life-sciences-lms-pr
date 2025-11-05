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

// Minimal authority homepage mapping for origin verification
const AUTHORITY_HOME: Record<string, string> = {
  'FDA': 'https://www.fda.gov',
  'EMA': 'https://www.ema.europa.eu',
  'ICH': 'https://www.ich.org'
}

export function proposeDraftFromReference(moduleId: string, ref: RegulatoryReference): DraftContent {
  const id = `draft-${Math.random().toString(36).slice(2, 8)}`
  const changeType: DraftContent['changeType'] = 'update'
  const status: DraftContent['status'] = 'pending-review'
  // Provide deeper, actionable update guidance
  const content = [
    `Update overview: Incorporate latest ${ref.authority} update — ${ref.document} (${ref.section}).`,
    '',
    'Curriculum changes:',
    '- Add a new slide explaining the update scope, applicability, and effective date.',
    '- Revise the "key controls" section to include specific expectations clarified by the update (map to SOPs).',
    '- Include a short scenario-based interactive exercise demonstrating compliant vs non-compliant practice.',
    '- Add a checklist for day-to-day execution aligned to the updated guidance.',
    '',
    'Learning objectives to add/refine:',
    '- Learner can summarize the update and identify impacted processes.',
    '- Learner can apply the updated control expectations to a realistic case.',
    '- Learner can locate the relevant SOP/work instruction section(s) reflecting the update.',
    '',
    'Assessment adjustments:',
    '- Add 2 knowledge-check questions targeting the updated expectation language.',
    '- Add 1 scenario question that tests decision-making under the new guidance.',
    '',
    'SOP/Policy mapping suggestions:',
    '- Link to SOP-001 Data Integrity (sections 4.2, 5.3) and WI-023 Signal Management triage (step 2).',
    '- Insert cross-reference to CAPA procedure for remediation expectations if gaps are detected.',
    '',
    'Examples and citations:',
    '- Provide 1 positive example and 1 anti-pattern specific to the update.',
    `- Cite primary source: ${ref.url}`
  ].join('\n')
  const rationale = `Regulatory trigger: ${ref.authority} — ${ref.document} (${ref.section}). Training should be updated to ensure alignment with clarified expectations, effective on ${new Date(ref.effectiveDate).toDateString()}.`
  return {
    id,
    moduleId,
    changeType,
    content,
    rationale,
    regulatoryTrigger: ref,
    status,
    generatedAt: new Date().toISOString(),
    comments: [],
    sources: [
      { label: `${ref.authority}: ${ref.document}`, url: ref.url },
      // Authority homepage for origin verification
      { label: `${ref.authority} — official site`, url: AUTHORITY_HOME[ref.authority] || ref.url }
    ]
  }
}

// Fingerprint used for deduplication across polling cycles
export function fingerprintDraft(d: DraftContent): string {
  const parts = [
    d.moduleId,
    d.changeType,
    d.regulatoryTrigger.authority,
    d.regulatoryTrigger.document,
    d.regulatoryTrigger.section,
    new Date(d.regulatoryTrigger.effectiveDate).toISOString(),
    d.regulatoryTrigger.url
  ]
  return parts.join('|').toLowerCase()
}

export function isDuplicateDraft(existing: DraftContent[], candidate: DraftContent): boolean {
  const fp = fingerprintDraft(candidate)
  const seen = new Set(existing.map(fingerprintDraft))
  return seen.has(fp)
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
