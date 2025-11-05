import type {
  LearningModule,
  UserProgress,
  Certification,
  DraftContent,
  LearnerMetric,
  ModuleMetric,
  AuditLogEntry
} from './types'
import { generateCertificateCode } from './helpers'

export const MOCK_MODULES: LearningModule[] = [
  {
    id: 'mod-001',
    title: 'Introduction to Good Clinical Practice (GCP)',
    description: 'Comprehensive introduction to ICH-GCP guidelines, ethical principles, and regulatory requirements for clinical trials.',
    domain: 'gcp',
    duration: 180,
    difficulty: 'beginner',
    prerequisites: [],
    content: [
      {
        id: 'sec-001',
        type: 'video',
        title: 'Fundamentals of GCP',
        content: 'Overview of ethical and scientific quality standards for clinical trials that involve human subjects. Emphasis on subject rights, safety, well-being, data integrity, and proportional, risk-based quality management.',
        duration: 45,
        transcript: 'Good Clinical Practice (GCP) is the international ethical and scientific quality standard for designing, conducting, recording, and reporting trials involving human subjects. Compliance with GCP assures that the rights, safety, and well‑being of trial participants are protected and that clinical trial data are credible. Core principles include informed consent and subject privacy, IRB/IEC oversight, scientifically sound protocols, qualified personnel, adequate resources, ongoing monitoring, accurate and contemporaneous records, and robust quality systems. ICH E6(R2) strengthens expectations around risk‑based quality management, vendor oversight, and data integrity, while the E6(R3) concept papers emphasize proportionality and critical‑to‑quality factors.',
        bookmarks: [
          { id: 'bm-001', timestamp: 0, note: 'What is GCP: ethical and scientific standard protecting subjects and ensuring credible data.' , createdAt: new Date().toISOString() },
          { id: 'bm-002', timestamp: 10, note: 'Core principles: informed consent, IRB/IEC, protocol adherence, monitoring, documentation.' , createdAt: new Date().toISOString() },
          { id: 'bm-003', timestamp: 20, note: 'Data integrity and ALCOA+: attributable, legible, contemporaneous, original, accurate (+ complete/consistent/enduring/available).', createdAt: new Date().toISOString() },
          { id: 'bm-004', timestamp: 30, note: 'Risk‑based quality management and vendor oversight per ICH E6(R2)/(R3) direction.', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'sec-002',
        type: 'text',
        title: 'ICH-GCP Guidelines Overview',
        content: 'The International Council for Harmonisation (ICH) E6(R2) guideline provides a unified standard for designing, conducting, recording, and reporting clinical trials. Core sections cover investigator and sponsor responsibilities, essential documents, protocol and investigator brochure requirements, safety reporting, and trial monitoring. E6(R2) adds expectations for risk-based monitoring (RBM), quality tolerance limits, and sponsor oversight of vendor systems. Upcoming E6(R3) drafts further emphasize proportionality, critical-to-quality factors, and modern digital technologies.',
        duration: 30
      },
      {
        id: 'sec-003',
        type: 'interactive',
        title: 'Ethical Principles Scenario',
        content: 'Apply Belmont Report principles (Respect for Persons, Beneficence, Justice) and ICH‑GCP to a vulnerable population consent scenario.',
        duration: 45,
        interaction: {
          question: 'A non‑English‑speaking subject is being enrolled in an emergency setting. What is the most compliant approach to consent?',
          options: [
            'Proceed with verbal consent only to avoid delays',
            'Use a short‑form consent with a qualified interpreter and impartial witness',
            'Enroll without consent due to emergency and document later',
            'Ask a family member to translate and sign on behalf of the subject'
          ],
          correctIndex: 1,
          rationale: 'ICH‑GCP and ethical norms allow short‑form consent when a full translation is unavailable, provided a qualified interpreter and impartial witness are used, and full consent is obtained as soon as feasible.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-001',
        title: 'GCP Knowledge Check',
        type: 'knowledge-check',
        questions: [],
        passingScore: 80,
        adaptive: true
      }
    ],
    certification: true,
    version: '2.1',
    status: 'published',
    createdBy: 'admin-001',
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    regulatoryReferences: [
      {
        authority: 'ICH',
        document: 'E6(R2) Good Clinical Practice',
        section: 'All',
        effectiveDate: '2016-11-09',
        url: 'https://database.ich.org/sites/default/files/E6_R2_Addendum.pdf'
      }
    ]
  },
  {
    id: 'mod-002',
    title: 'Pharmacovigilance Fundamentals',
    description: 'Essential principles of pharmacovigilance, adverse event reporting, and signal detection in accordance with GPVP guidelines.',
    domain: 'pharmacovigilance',
    duration: 240,
    difficulty: 'intermediate',
    prerequisites: [],
    content: [
      {
        id: 'sec-004',
        type: 'video',
        title: 'Introduction to Pharmacovigilance',
  content: 'Pharmacovigilance (PV) is the science and activities for detecting, assessing, understanding, and preventing adverse effects or other medicine‑related problems. This module covers GPVP foundations, safety data sources, and signal detection basics.',
  duration: 50,
        transcript: 'Pharmacovigilance ensures that the benefit‑risk profile of medicinal products remains positive throughout their lifecycle. Core processes include intake and processing of individual case safety reports, medical coding (MedDRA), causality and seriousness assessment, expedited and periodic reporting, and signal management. Data sources include spontaneous reports, literature, studies and registries, EHR/claims, and social media (with caution). Signal detection combines quantitative methods with medical judgment per GVP Module IX.',
        bookmarks: [
          { id: 'bm-101', timestamp: 0, note: 'PV purpose: maintain positive benefit‑risk across the product lifecycle.', createdAt: new Date().toISOString() },
          { id: 'bm-102', timestamp: 12, note: 'ICSR processing: case intake → coding → assessment → reporting obligations.', createdAt: new Date().toISOString() },
          { id: 'bm-103', timestamp: 24, note: 'Data sources: spontaneous, literature, clinical, real‑world (EHR/claims).', createdAt: new Date().toISOString() },
          { id: 'bm-104', timestamp: 36, note: 'Signal detection: disproportionality + clinical review per GVP IX.', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'sec-005',
        type: 'text',
        title: 'Adverse Event Reporting Requirements',
        content: 'Covers AE and ADR definitions, seriousness and expectedness assessments, and expedited reporting timelines: SUSARs (7/15-day rules), device-drug considerations, follow-up information, and periodic reports (PSUR/PBRER). Includes E2A/E2D/MedDRA coding practices, EMA EudraVigilance submission, FDA FAERS/VAERS, and MHRA Yellow Card. Emphasizes case processing workflow, data quality, causality, duplicate detection, and compliance metrics.',
        duration: 60
      },
      {
        id: 'sec-006',
        type: 'scenario',
        title: 'Signal Detection Case Study',
        content: 'Perform initial signal triage after an increase in hepatic adverse events in spontaneous reports. Consider thresholds, confounders, and next steps per GVP IX.',
        duration: 70,
        interaction: {
          question: 'Your team observes a disproportionality signal for hepatic events. What is the next best step?',
          options: [
            'Immediately update the label with a boxed warning',
            'Validate the signal with case review and clinical plausibility assessment',
            'Close the signal because spontaneous data are unreliable',
            'Report all historical cases as expedited SUSARs'
          ],
          correctIndex: 1,
          rationale: 'GVP Module IX recommends validation via medical review, clinical plausibility, and additional analyses before determining regulatory actions.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-002',
        title: 'Pharmacovigilance Assessment',
        type: 'final',
        questions: [],
        passingScore: 85,
        timeLimit: 60,
        adaptive: true
      }
    ],
    certification: true,
    version: '1.8',
    status: 'published',
    createdBy: 'admin-001',
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    regulatoryReferences: [
      {
        authority: 'EMA',
        document: 'Guideline on good pharmacovigilance practices (GVP)',
        section: 'Module I-X',
        effectiveDate: '2012-10-09',
        url: 'https://www.ema.europa.eu/en/human-regulatory/post-authorisation/pharmacovigilance'
      }
    ]
  },
  {
    id: 'mod-003',
    title: 'Good Manufacturing Practice (GMP) Essentials',
    description: 'Core principles of pharmaceutical manufacturing quality systems, documentation, and compliance with GMP regulations.',
    domain: 'gmp',
    duration: 300,
    difficulty: 'intermediate',
    prerequisites: [],
    content: [
      {
        id: 'sec-007',
        type: 'video',
        title: 'GMP Quality Systems',
        content: 'Overview of quality management systems in pharmaceutical manufacturing: Quality Manual, Management Responsibility, Change Control, Deviation/CAPA, Internal Audits, Supplier Qualification, Training, and Validation. Aligns with ICH Q10 and 21 CFR Parts 210/211.',
        duration: 55,
        transcript: 'GMP quality systems aim to consistently produce medicinal products that meet specifications and patient needs. Key elements include management responsibility and quality planning, robust procedures and records, training and qualification, controlled change management, deviation investigation and effective CAPA, internal audits, and supplier oversight. Alignment with ICH Q10 links these elements for continual improvement within a pharmaceutical quality system.',
        bookmarks: [
          { id: 'bm-201', timestamp: 0, note: 'GMP objective and link to patient safety and product quality.', createdAt: new Date().toISOString() },
          { id: 'bm-202', timestamp: 14, note: 'Quality System elements: SOPs, records, training, change control.', createdAt: new Date().toISOString() },
          { id: 'bm-203', timestamp: 28, note: 'Deviation/CAPA lifecycle and effectiveness checks.', createdAt: new Date().toISOString() },
          { id: 'bm-204', timestamp: 42, note: 'Supplier qualification and internal audits to ensure control.', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'sec-008',
        type: 'text',
        title: 'Documentation and Record Keeping',
        content: 'Requirements for GDP (Good Documentation Practices), batch records, master records, and SOPs, with ALCOA+ principles (Attributable, Legible, Contemporaneous, Original, Accurate, Complete, Consistent, Enduring, Available). Includes 21 CFR Part 11 expectations for electronic records/signatures: audit trails, user access controls, validation, and record retention.',
        duration: 65
      },
      {
        id: 'sec-009',
        type: 'interactive',
        title: 'Deviation Management Simulation',
        content: 'Investigate a deviation using 5‑Whys and determine an effective CAPA that addresses root cause, with appropriate effectiveness checks.',
        duration: 80,
        interaction: {
          question: 'A recurring equipment failure is traced to inadequate preventive maintenance frequency. What is the best CAPA?',
          options: [
            'Retrain operators on equipment cleaning',
            'Increase maintenance frequency and update the PM SOP with effectiveness checks',
            'Add a new sign‑off field in the batch record',
            'Quarantine all batches for one month'
          ],
          correctIndex: 1,
          rationale: 'Addressing root cause requires adjusting the PM schedule and SOP, with documented effectiveness verification, rather than unrelated retraining or cosmetic controls.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-003',
        title: 'GMP Certification Exam',
        type: 'final',
        questions: [],
        passingScore: 85,
        timeLimit: 90,
        adaptive: false
      }
    ],
    certification: true,
    version: '3.0',
    status: 'published',
    createdBy: 'admin-001',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    regulatoryReferences: [
      {
        authority: 'FDA',
        document: '21 CFR Parts 210 & 211',
        section: 'All',
        effectiveDate: '2023-01-01',
        url: 'https://www.fda.gov/drugs/pharmaceutical-quality-resources/current-good-manufacturing-practice-cgmp-regulations'
      }
    ]
  },
  {
    id: 'mod-004',
    title: 'Regulatory Affairs Strategy',
    description: 'Advanced strategies for regulatory submissions, agency interactions, and global regulatory intelligence.',
    domain: 'regulatory-affairs',
    duration: 360,
    difficulty: 'advanced',
    prerequisites: ['mod-001'],
    content: [
      {
        id: 'sec-010',
        type: 'video',
        title: 'Global Regulatory Landscape',
        content: 'Orientation to global agencies (FDA, EMA, PMDA, MHRA, Health Canada) and harmonization via ICH. Discusses pathways (IND/CTA, NDA/BLA, MAA), expedited programs (Breakthrough, PRIME), and labeling/CMC alignment challenges in multi-region submissions.',
        duration: 70,
        transcript: 'Global regulatory strategy balances scientific evidence with varied regional expectations. Sponsors engage with agencies through scientific advice, Type B/C meetings, and parallel consultations. Harmonization via ICH supports CTD/eCTD structures, but regional Module 1 requirements differ. Expedited programs like Breakthrough Therapy (FDA) and PRIME (EMA) can accelerate development where criteria are met.',
        bookmarks: [
          { id: 'bm-301', timestamp: 0, note: 'Agencies and harmonization: FDA, EMA, PMDA, MHRA, Health Canada; role of ICH.', createdAt: new Date().toISOString() },
          { id: 'bm-302', timestamp: 18, note: 'Regulatory pathways: IND/CTA → NDA/BLA/MAA; scientific advice and meetings.', createdAt: new Date().toISOString() },
          { id: 'bm-303', timestamp: 36, note: 'Expedited programs and criteria (Breakthrough, PRIME).', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'sec-011',
        type: 'text',
        title: 'Submission Strategy Development',
        content: 'End-to-end submission strategy including target product profile (TPP), regulatory intelligence, meeting packages (Type B/C, Scientific Advice), CTD/eCTD structure (M1–M5), and readiness (gap assessments, pre-approval inspections). Incorporates risk management plans (RMP), pediatric plans (PIP), and post-marketing commitments.',
        duration: 90
      }
    ],
    assessments: [
      {
        id: 'assess-004',
        title: 'Regulatory Strategy Assessment',
        type: 'final',
        questions: [],
        passingScore: 80,
        timeLimit: 120,
        adaptive: true
      }
    ],
    certification: true,
    version: '1.5',
    status: 'published',
    createdBy: 'admin-002',
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    regulatoryReferences: [
      {
        authority: 'ICH',
        document: 'M4 Common Technical Document',
        section: 'All',
        effectiveDate: '2017-06-02',
        url: 'https://www.ich.org/page/ctd'
      }
    ]
  },
  {
    id: 'mod-005',
    title: 'Quality Assurance in Clinical Trials',
    description: 'Quality assurance methodologies, audit techniques, and CAPA systems for clinical research.',
    domain: 'quality-assurance',
    duration: 270,
    difficulty: 'intermediate',
    prerequisites: ['mod-001'],
    content: [
      {
        id: 'sec-012',
        type: 'video',
        title: 'QA Principles and Frameworks',
        content: 'Foundation of QA in clinical research: SOP governance, audit program design (risk-based), vendor oversight, TMF quality, data integrity, and issue management. Aligns with ICH E6(R2), ISO 9001 principles, and EMA/MHRA expectations.',
        duration: 60,
        transcript: 'Quality assurance provides confidence that clinical research is conducted, and data are generated, in accordance with applicable standards. A risk‑based QA program covers SOP governance, qualified auditors, independence, a risk‑driven audit plan, TMF and data integrity checks, issue management, and vendor oversight. Outputs drive CAPA and continual improvement.',
        bookmarks: [
          { id: 'bm-401', timestamp: 0, note: 'Role of QA: confidence via independent oversight and continuous improvement.', createdAt: new Date().toISOString() },
          { id: 'bm-402', timestamp: 15, note: 'Risk‑based audit program and vendor oversight.', createdAt: new Date().toISOString() },
          { id: 'bm-403', timestamp: 30, note: 'TMF quality and data integrity checks.', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'sec-013',
        type: 'interactive',
        title: 'Audit Planning Exercise',
        content: 'Plan and execute a site/vendor audit including scope, sampling strategy, evidence collection, classification of findings, and CAPA follow‑up.',
        duration: 90,
        interaction: {
          question: 'During an audit you observe missing signatures on several source documents with no impact to data integrity. What is the most appropriate classification?',
          options: [
            'Critical',
            'Major',
            'Minor',
            'Opportunity for Improvement only'
          ],
          correctIndex: 2,
          rationale: 'Missing signatures without data integrity impact typically constitute a Minor finding; however, trending may elevate significance if systemic.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-005',
        title: 'QA Competency Assessment',
        type: 'final',
        questions: [],
        passingScore: 85,
        timeLimit: 75,
        adaptive: true
      }
    ],
    certification: true,
    version: '2.3',
    status: 'published',
    createdBy: 'admin-001',
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    regulatoryReferences: [
      {
        authority: 'ICH',
        document: 'E6(R2) Section 5.19',
        section: '5.19 Monitoring',
        effectiveDate: '2016-11-09',
        url: 'https://database.ich.org/sites/default/files/E6_R2_Addendum.pdf'
      }
    ]
  }
]

export const MOCK_USER_PROGRESS: UserProgress[] = [
  {
    userId: 'user-001',
    moduleId: 'mod-001',
    status: 'completed',
    progress: 100,
    currentSection: 3,
    assessmentResults: [
      {
        assessmentId: 'assess-001',
        score: 92,
        passed: true,
        attempts: 1,
        answers: [],
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        timeSpent: 25
      }
    ],
    timeSpent: 165,
    lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    adaptivePath: ['sec-001', 'sec-002', 'sec-003'],
    performanceMetrics: {
      comprehensionScore: 92,
      retentionScore: 88,
      speedScore: 85,
      consistencyScore: 90,
      recommendedDifficulty: 'medium'
    }
  },
  {
    userId: 'user-001',
    moduleId: 'mod-002',
    status: 'in-progress',
    progress: 65,
    currentSection: 2,
    assessmentResults: [],
    timeSpent: 120,
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    adaptivePath: ['sec-004', 'sec-005'],
    performanceMetrics: {
      comprehensionScore: 85,
      retentionScore: 82,
      speedScore: 78,
      consistencyScore: 84,
      recommendedDifficulty: 'medium'
    }
  },
  {
    userId: 'user-001',
    moduleId: 'mod-005',
    status: 'not-started',
    progress: 0,
    currentSection: 0,
    assessmentResults: [],
    timeSpent: 0,
    lastAccessed: new Date().toISOString(),
    adaptivePath: [],
    performanceMetrics: {
      comprehensionScore: 0,
      retentionScore: 0,
      speedScore: 0,
      consistencyScore: 0,
      recommendedDifficulty: 'medium'
    }
  }
]

export const MOCK_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-001',
    moduleId: 'mod-001',
    moduleName: 'Introduction to Good Clinical Practice (GCP)',
    issuedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString(),
    certificateUrl: '/certificates/cert-001.pdf',
    verificationCode: generateCertificateCode(),
    status: 'active'
  }
]

export const MOCK_DRAFT_CONTENT: DraftContent[] = [
  {
    id: 'draft-001',
    moduleId: 'mod-002',
    changeType: 'update',
    content: 'Updated adverse event reporting requirements to reflect new EMA guidance on reporting timelines for DME events. Key changes include: expedited reporting within 7 days for device-drug combination products, enhanced requirements for periodic safety update reports (PSURs), and new signal management procedures.',
    rationale: 'EMA updated GVP Module VI to align with new Medical Device Regulation (MDR) requirements',
    regulatoryTrigger: {
      authority: 'EMA',
      document: 'GVP Module VI Amendment',
      section: '6.2',
      effectiveDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.ema.europa.eu/en/documents/regulatory-procedural-guideline/guideline-good-pharmacovigilance-practices-gvp-module-vi-collection-management-submission-reports_en.pdf'
    },
    status: 'pending-review',
    generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: 'draft-002',
    moduleId: 'mod-003',
    changeType: 'new',
    content: 'New section required: Data Integrity and ALCOA+ Principles. FDA has emphasized enhanced focus on data integrity across all GMP operations. This section covers: Attributable, Legible, Contemporaneous, Original, Accurate principles plus Complete, Consistent, Enduring, and Available.',
    rationale: 'FDA issued updated guidance on Data Integrity and Compliance with Drug CGMP',
    regulatoryTrigger: {
      authority: 'FDA',
      document: 'Data Integrity Guidance 2024',
      section: 'All',
      effectiveDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/data-integrity-and-compliance-drug-cgmp'
    },
    status: 'approved',
    generatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: 'admin-001',
    reviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    comments: ['Excellent addition', 'Include case studies from recent warning letters']
  }
]

export const MOCK_LEARNER_METRICS: LearnerMetric[] = [
  {
    userId: 'user-001',
    userName: 'Current User',
    modulesCompleted: 1,
    averageScore: 92,
    timeSpent: 285,
    engagementScore: 88,
    predictedSuccess: 94,
    atRisk: false
  },
  {
    userId: 'user-002',
    userName: 'Sarah Chen',
    modulesCompleted: 3,
    averageScore: 89,
    timeSpent: 540,
    engagementScore: 92,
    predictedSuccess: 91,
    atRisk: false
  },
  {
    userId: 'user-003',
    userName: 'Michael Rodriguez',
    modulesCompleted: 2,
    averageScore: 76,
    timeSpent: 420,
    engagementScore: 68,
    predictedSuccess: 72,
    atRisk: true
  }
]

export const MOCK_MODULE_METRICS: ModuleMetric[] = [
  {
    moduleId: 'mod-001',
    moduleName: 'Introduction to Good Clinical Practice (GCP)',
    enrollments: 156,
    completions: 142,
    averageScore: 87,
    averageTime: 170,
    dropoffPoints: ['sec-003'],
    effectiveness: 91
  },
  {
    moduleId: 'mod-002',
    moduleName: 'Pharmacovigilance Fundamentals',
    enrollments: 98,
    completions: 76,
    averageScore: 84,
    averageTime: 235,
    dropoffPoints: ['sec-006'],
    effectiveness: 78
  },
  {
    moduleId: 'mod-003',
    moduleName: 'Good Manufacturing Practice (GMP) Essentials',
    enrollments: 134,
    completions: 118,
    averageScore: 86,
    averageTime: 285,
    dropoffPoints: [],
    effectiveness: 88
  }
]

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userId: 'user-001',
    userName: 'Current User',
    action: 'MODULE_COMPLETED',
    resource: 'learning_module',
    resourceId: 'mod-001',
    details: { score: 92, duration: 165 }
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    userId: 'user-001',
    userName: 'Current User',
    action: 'ASSESSMENT_PASSED',
    resource: 'assessment',
    resourceId: 'assess-001',
    details: { score: 92, attempts: 1 }
  },
  {
    id: 'audit-003',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: 'admin-001',
    userName: 'Admin User',
    action: 'CONTENT_APPROVED',
    resource: 'draft_content',
    resourceId: 'draft-002',
    details: { changeType: 'new', moduleId: 'mod-003' }
  }
]