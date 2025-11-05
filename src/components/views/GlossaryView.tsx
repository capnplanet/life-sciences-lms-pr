import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMemo, useState } from 'react'

type Term = { term: string; definition: string; alias?: string[] }

const TERMS: Term[] = [
  { term: 'GCP (Good Clinical Practice)', definition: 'An international ethical and scientific quality standard for designing, conducting, recording, and reporting trials that involve human subjects (ICH E6).' },
  { term: 'GMP (Good Manufacturing Practice)', definition: 'Regulations that require manufacturers to ensure products are consistently produced and controlled according to quality standards (21 CFR Parts 210/211; EU GMP).' },
  { term: 'GLP (Good Laboratory Practice)', definition: 'Quality system concerned with the organizational process and conditions under which non-clinical health and environmental safety studies are planned, performed, monitored, recorded, archived, and reported.' },
  { term: 'ICH', definition: 'International Council for Harmonisation of Technical Requirements for Pharmaceuticals for Human Use. Publishes harmonized guidelines like E6 (GCP) and M4 (CTD).' },
  { term: 'CTD/eCTD', definition: 'Common Technical Document (and its electronic format) structure for regulatory submissions (ICH M4).'},
  { term: 'TMF (Trial Master File)', definition: 'Collection of documents that allows the conduct of a clinical trial to be reconstructed and evaluated (ICH E6(R2)).' },
  { term: 'SUSAR', definition: 'Serious Unexpected Suspected Adverse Reaction. Reporting timelines: 7 days (fatal/life-threatening initial), 15 days otherwise; regional specifics apply (e.g., GVP Module VI).' },
  { term: 'AE/SAE', definition: 'Adverse Event / Serious Adverse Event. Any untoward medical occurrence; “serious” if it results in death, is life-threatening, requires hospitalization/prolongation, results in disability or congenital anomaly.' },
  { term: 'CAPA', definition: 'Corrective and Preventive Action. Systematic approach to identify, investigate, correct, and prevent quality issues.' },
  { term: 'ALCOA+', definition: 'Data integrity principles: Attributable, Legible, Contemporaneous, Original, Accurate (+ Complete, Consistent, Enduring, Available).' },
  { term: 'Part 11 (21 CFR 11)', definition: 'U.S. FDA regulation on electronic records and electronic signatures; requires controls for authenticity, integrity, and, when appropriate, confidentiality.' },
  { term: 'RBM (Risk-Based Monitoring)', definition: 'Monitoring strategy focusing on critical data and processes, leveraging centralized statistical monitoring and on-site visits as needed.' },
  { term: 'Signal Detection', definition: 'Process of identifying potential safety signals from adverse event data and other sources; part of pharmacovigilance.' },
  { term: 'PBRER/PSUR', definition: 'Periodic benefit-risk evaluation report / Periodic safety update report; periodic PV reports evaluating benefit-risk balance.' },
  { term: 'SOP', definition: 'Standard Operating Procedure; written instruction to achieve uniformity of the performance of a specific function.' },
  { term: 'QA/QC', definition: 'Quality Assurance / Quality Control. QA is process-oriented; QC is product-oriented testing and verification.' },
  { term: 'GVP', definition: 'Good Pharmacovigilance Practices; EMA guideline modules covering PV systems and processes.' },
  { term: 'TPP (Target Product Profile)', definition: 'A strategic document that outlines desired labeling concepts and pivotal attributes to guide development and regulatory strategy.' },
  { term: 'Deviation/Nonconformance', definition: 'Departure from approved procedures/specifications; requires investigation, impact assessment, and CAPA as appropriate.' },
  { term: 'Change Control', definition: 'Formal process to propose, assess, approve, implement, and verify changes to systems, documents, or processes.' }
]

export function GlossaryView() {
  const [query, setQuery] = useState('')
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TERMS
    return TERMS.filter(t =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      (t.alias?.some(a => a.toLowerCase().includes(q)) ?? false)
    )
  }, [query])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Glossary</h1>
        <p className="text-muted-foreground mt-1">Key terms and definitions for regulated life sciences training</p>
      </div>

      <div className="max-w-xl">
        <Input placeholder="Search terms..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => (
          <Card key={t.term}>
            <CardHeader>
              <CardTitle className="text-base">{t.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{t.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
