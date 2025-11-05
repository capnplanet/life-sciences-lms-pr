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
          { id: 'bm-001', timestamp: 0, note: 'Definition and purpose: G C P protects subjects and ensures credible data across the trial lifecycle. Link to Belmont principles and I R B / I E C oversight.', createdAt: new Date().toISOString() },
          { id: 'bm-002', timestamp: 8, note: 'Ethical foundation: Respect, Beneficence, Justice → operationalized via informed consent, privacy, and ongoing safety monitoring.', createdAt: new Date().toISOString() },
          { id: 'bm-003', timestamp: 16, note: 'Protocol design: identify critical‑to‑quality (C T Q) factors; predefine endpoints, monitoring plans, Q T Ls, and risk controls.', createdAt: new Date().toISOString() },
          { id: 'bm-004', timestamp: 24, note: 'Informed consent specifics: version control, language, interpreter/witness when needed, copy to subject; re‑consent on amendments.', createdAt: new Date().toISOString() },
          { id: 'bm-005', timestamp: 32, note: 'Investigator responsibilities (E6 4.1): adequate staff, facilities, training; delegation logs; oversight of tasks and vendors.', createdAt: new Date().toISOString() },
          { id: 'bm-006', timestamp: 40, note: 'Monitoring: risk‑based mix of centralized and on‑site; focus on C T Q; use K R I s and Q T Ls to detect and act on issues early.', createdAt: new Date().toISOString() },
          { id: 'bm-007', timestamp: 48, note: 'Data integrity (A L C O A+): contemporaneous entries, controlled records, audit trails; avoid backdating and shared logins—examples included.', createdAt: new Date().toISOString() },
          { id: 'bm-008', timestamp: 56, note: 'Essential documents and T M F: organize by zone; ensure completeness, retrievability, and version history for inspections.', createdAt: new Date().toISOString() },
          { id: 'bm-009', timestamp: 64, note: 'Computerized systems and vendors: validation/qualification, access controls, change control, service‑level expectations.', createdAt: new Date().toISOString() },
          { id: 'bm-010', timestamp: 72, note: 'Common findings: missing consent pages, protocol deviations not assessed, incomplete source; prevention tips and quality checks.', createdAt: new Date().toISOString() }
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
      },
      {
        id: 'sec-014',
        type: 'interactive',
        title: 'Informed Consent Documentation Check',
        content: 'Confirm essential elements of informed consent documentation for a clinical trial subject.',
        duration: 25,
        interaction: {
          question: 'Which combination best reflects required consent documentation at enrollment?',
          options: [
            'Signed consent form, version/date, subject copy provided',
            'Verbal consent recorded only',
            'Email from subject confirming interest',
            'Investigator notes stating subject agreed'
          ],
          correctIndex: 0,
          rationale: 'Documented informed consent includes signature/initials as applicable, correct version/date controlled copy, and a copy provided to the subject.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-001',
        title: 'GCP Knowledge Check',
        type: 'knowledge-check',
        questions: [
          {
            id: 'q-gcp-1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'What is the primary purpose of G C P?',
            options: [
              'To accelerate drug approvals',
              'To protect subjects and ensure credible data',
              'To reduce trial costs',
              'To eliminate the need for monitoring'
            ],
            correctAnswer: 'To protect subjects and ensure credible data',
            explanation: 'G C P focuses on participant rights, safety, well‑being, and data integrity.',
            regulatoryContext: 'I C H E6(R2) 2.1–2.3'
          },
          {
            id: 'q-gcp-2',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Which is an example of A L C O A+?',
            options: [
              'Backdating entries to match dosing time',
              'Contemporaneous recording at the time of activity',
              'Transcribing notes weekly',
              'Using sticky notes for later entry'
            ],
            correctAnswer: 'Contemporaneous recording at the time of activity',
            explanation: 'Records must be contemporaneous, original, accurate, complete, consistent, enduring, and available.',
            regulatoryContext: 'A L C O A+'
          },
          {
            id: 'q-gcp-3',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Risk‑based monitoring is intended to…',
            options: [
              'Eliminate all on‑site visits',
              'Focus oversight on critical‑to‑quality factors',
              'Replace monitoring with auditing',
              'Ensure 100% source data verification'
            ],
            correctAnswer: 'Focus oversight on critical‑to‑quality factors',
            explanation: 'E6(R2) encourages proportional oversight based on risk.',
            regulatoryContext: 'I C H E6(R2) 5.0'
          },
          {
            id: 'q-gcp-4',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Who is responsible for ensuring adequate resources and qualified personnel for the trial?',
            options: ['Institution', 'Sponsor', 'IRB/IEC', 'Investigator'],
            correctAnswer: 'Investigator',
            explanation: 'The investigator is responsible for resources and qualifications.',
            regulatoryContext: 'I C H E6(R2) 4.1'
          },
          {
            id: 'q-gcp-5',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Which document set contains essential documents for trial conduct and evaluation?',
            options: ['CSR', 'T M F', 'IB', 'CRF'],
            correctAnswer: 'T M F',
            explanation: 'The Trial Master File contains essential documents.',
            regulatoryContext: 'I C H E6(R2) 8'
          }
          ,
          {
            id: 'q-gcp-6',
            type: 'multi-select',
            difficulty: 'medium',
            question: 'Select essential elements typically required in informed consent:',
            options: [
              'Purpose of the trial',
              'Guaranteed therapeutic benefit',
              'Risks and discomforts',
              'Voluntary participation and right to withdraw'
            ],
            correctAnswer: ['Purpose of the trial','Risks and discomforts','Voluntary participation and right to withdraw'],
            explanation: 'Consent should disclose purpose, risks, benefits, alternatives, and emphasize voluntariness and withdrawal rights; no guarantee of benefit.',
            regulatoryContext: 'I C H E6(R2) 4.8'
          },
          {
            id: 'q-gcp-7',
            type: 'mcq',
            difficulty: 'easy',
            question: 'The I R B / I E C is primarily responsible for…',
            options: ['Protocol authorship','Funding approvals','Protecting rights, safety, and well‑being of subjects','Monitoring site inventory'],
            correctAnswer: 'Protecting rights, safety, and well‑being of subjects',
            explanation: 'I R B / I E C provides independent ethical oversight.',
            regulatoryContext: 'I C H E6(R2) 3'
          },
          {
            id: 'q-gcp-8',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Quality tolerance limits (Q T L s) are used to…',
            options: ['Replace audits','Define thresholds for deviations impacting quality','Eliminate monitoring','Reduce protocol complexity'],
            correctAnswer: 'Define thresholds for deviations impacting quality',
            explanation: 'Q T L s signal when quality may be compromised and trigger evaluation.',
            regulatoryContext: 'I C H E6(R2) 5.0'
          },
          {
            id: 'q-gcp-9',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Essential documents collectively…',
            options: ['Are optional','Permit evaluation of trial conduct and data quality','Replace source data','Are stored only after trial end'],
            correctAnswer: 'Permit evaluation of trial conduct and data quality',
            explanation: 'Essential documents enable reconstruction of conduct and verification of data.',
            regulatoryContext: 'I C H E6(R2) 8'
          },
          {
            id: 'q-gcp-10',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Centralized monitoring can…',
            options: ['Fully replace all on‑site activities in every scenario','Support targeted on‑site monitoring by analyzing critical risks','Conflict with G C P principles','Be used only in late‑phase trials'],
            correctAnswer: 'Support targeted on‑site monitoring by analyzing critical risks',
            explanation: 'Centralized methods complement proportionate on‑site activities per risk.',
            regulatoryContext: 'I C H E6(R2) 5.18'
          }
        ],
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
        transcript: 'Pharmacovigilance ensures that the benefit‑risk profile of medicinal products remains positive throughout their lifecycle. Core processes include intake and processing of individual case safety reports (ICSRs), medical coding (MedDRA), causality and seriousness assessment, expedited and periodic reporting, and signal management. Data sources include spontaneous reports, literature, studies and registries, EHR/claims, and social media (with caution). Signal detection combines quantitative methods with medical judgment per GVP Module IX; actions range from additional monitoring to labeling changes or RMP updates.',
        bookmarks: [
          { id: 'bm-101', timestamp: 0, note: 'PV objective: protect patients by continuously assessing benefit‑risk and acting on new safety information.', createdAt: new Date().toISOString() },
          { id: 'bm-102', timestamp: 8, note: 'ICSR flow: intake → de‑duplication → MedDRA coding → seriousness/expectedness → causality → regulatory reporting (FAERS/EudraVigilance).', createdAt: new Date().toISOString() },
          { id: 'bm-103', timestamp: 16, note: 'Seriousness vs expectedness: drives expedited timelines (7/15‑day S U S A R rules) and periodic reporting.', createdAt: new Date().toISOString() },
          { id: 'bm-104', timestamp: 24, note: 'Data sources: spontaneous, literature screening, clinical studies, registries, E H R/claims; strengths/limits and bias considerations.', createdAt: new Date().toISOString() },
          { id: 'bm-105', timestamp: 32, note: 'Signal detection methods: P R R / R O R thresholds + clinical review; triage, validation, analysis, assessment, recommendation.', createdAt: new Date().toISOString() },
          { id: 'bm-106', timestamp: 40, note: 'Periodic aggregate reports: P S U R / P B R E R content and when to update labeling and risk minimization.', createdAt: new Date().toISOString() },
          { id: 'bm-107', timestamp: 48, note: 'Roles and governance: Q P P V accountability, safety management team, decision logs, and health authority interactions.', createdAt: new Date().toISOString() }
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
      },
      {
        id: 'sec-015',
        type: 'interactive',
        title: 'Seriousness and Expectedness',
        content: 'Classify an adverse event for reporting obligations based on seriousness and expectedness.',
        duration: 25,
        interaction: {
          question: 'A hospitalized case of hepatic failure is not described in the current label. What applies?',
          options: [
            'Not serious; periodic only',
            'Serious and unexpected; expedited reporting timelines apply',
            'Expected; no expedited reporting',
            'Never report unless confirmed by biopsy'
          ],
          correctIndex: 1,
          rationale: 'Hospitalization and life‑threatening outcomes are serious; if not in label, it is unexpected and may be expedited per jurisdictional timelines.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-002',
        title: 'Pharmacovigilance Assessment',
        type: 'final',
        questions: [
          {
            id: 'q-pv-1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'A S U S A R is…',
            options: [
              'A serious, unexpected, suspected adverse reaction',
              'A standard unreviewed safety assessment report',
              'A sponsor utilization summary and review',
              'A signal of uncertain significance and risk'
            ],
            correctAnswer: 'A serious, unexpected, suspected adverse reaction',
            explanation: 'S U S A R combines seriousness, unexpectedness, and suspected causality.',
            regulatoryContext: 'E2A/E2D'
          },
          {
            id: 'q-pv-2',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Which source is NOT typical for signal detection?',
            options: ['Spontaneous reports', 'Literature', 'Financial forecasts', 'Clinical studies'],
            correctAnswer: 'Financial forecasts',
            explanation: 'Signal detection relies on clinical and real‑world safety data sources.',
            regulatoryContext: 'G V P Module IX'
          },
          {
            id: 'q-pv-3',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Validation of a signal typically involves…',
            options: [
              'Immediate label change',
              'Case review and clinical plausibility assessment',
              'Closing the signal due to uncertainty',
              'Automatic expedited reporting of all cases'
            ],
            correctAnswer: 'Case review and clinical plausibility assessment',
            explanation: 'Validation precedes assessment and action.',
            regulatoryContext: 'G V P Module IX'
          },
          {
            id: 'q-pv-4',
            type: 'mcq',
            difficulty: 'hard',
            question: 'MedDRA is used primarily for…',
            options: ['Statistical programming', 'Medical coding of cases', 'Budget management', 'Manufacturing records'],
            correctAnswer: 'Medical coding of cases',
            explanation: 'MedDRA standardizes medical terminology for safety data.',
            regulatoryContext: 'MedDRA'
          },
          {
            id: 'q-pv-5',
            type: 'mcq',
            difficulty: 'medium',
            question: 'A hospitalization following an adverse event is considered…',
            options: ['Non‑serious', 'Serious', 'Expected', 'Unrelated'],
            correctAnswer: 'Serious',
            explanation: 'Hospitalization is a seriousness criterion.',
            regulatoryContext: 'ICH/EMA definitions'
          }
          ,
          {
            id: 'q-pv-6',
            type: 'multi-select',
            difficulty: 'medium',
            question: 'Which are seriousness criteria?',
            options: ['Hospitalization','Death','Lack of efficacy','Congenital anomaly/birth defect'],
            correctAnswer: ['Hospitalization','Death','Congenital anomaly/birth defect'],
            explanation: 'Seriousness includes death, life‑threatening, hospitalization, disability/incapacity, congenital anomaly, or other medically important event.',
            regulatoryContext: 'ICH/EMA definitions'
          },
          {
            id: 'q-pv-7',
            type: 'mcq',
            difficulty: 'medium',
            question: 'P B R E R focuses on…',
            options: ['Individual case narratives', 'Aggregate benefit‑risk evaluation', 'Manufacturing deviations', 'Advertising claims'],
            correctAnswer: 'Aggregate benefit‑risk evaluation',
            explanation: 'Periodic reports summarize safety for aggregate benefit‑risk assessment.',
            regulatoryContext: 'P B R E R guidance'
          },
          {
            id: 'q-pv-8',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Unexpectedness is determined by…',
            options: ['Causality only','Listing in reference safety information/label','Case narrative length','Signal disproportionality value'],
            correctAnswer: 'Listing in reference safety information/label',
            explanation: 'Unexpectedness compares event with reference safety information.',
            regulatoryContext: 'E2A/E2D'
          },
          {
            id: 'q-pv-9',
            type: 'mcq',
            difficulty: 'medium',
            question: 'After signal validation, next is…',
            options: ['Immediate label change', 'Signal assessment and prioritization', 'Close signal due to uncertainty', 'Routine PSUR only'],
            correctAnswer: 'Signal assessment and prioritization',
            explanation: 'Assessment determines need for actions and prioritization.',
            regulatoryContext: 'G V P Module IX'
          },
          {
            id: 'q-pv-10',
            type: 'mcq',
            difficulty: 'easy',
            question: 'The Q P P V is responsible for…',
            options: ['Study site scheduling', 'Pharmacovigilance system oversight', 'Manufacturing batch release', 'Pricing negotiations'],
            correctAnswer: 'Pharmacovigilance system oversight',
            explanation: 'Q P P V ensures PV system compliance and oversight in the E U.',
            regulatoryContext: 'EU PV requirements'
          }
        ],
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
          { id: 'bm-201', timestamp: 0, note: 'G M P objective: consistent quality and patient safety; link to product lifecycle and continual improvement.', createdAt: new Date().toISOString() },
          { id: 'bm-202', timestamp: 8, note: 'Quality System: Quality Manual, procedures, training, records control; management review and quality planning cadence.', createdAt: new Date().toISOString() },
          { id: 'bm-203', timestamp: 16, note: 'Change control: impact assessment, risk evaluation, pre‑approval, verification/validation, and effectiveness review.', createdAt: new Date().toISOString() },
          { id: 'bm-204', timestamp: 24, note: 'Deviation/C A P A lifecycle: root cause (5‑Whys/Fishbone), corrective vs preventive, effectiveness checks with objective criteria.', createdAt: new Date().toISOString() },
          { id: 'bm-205', timestamp: 32, note: 'Supplier qualification: risk‑based approval, technical/quality agreements, monitoring, and periodic requalification.', createdAt: new Date().toISOString() },
          { id: 'bm-206', timestamp: 40, note: 'Data integrity (Part 11): unique logins, audit trails, validation documentation, backup/restore testing.', createdAt: new Date().toISOString() },
          { id: 'bm-207', timestamp: 48, note: 'Cleaning validation: acceptance criteria, swab/rinse methods, worst‑case selection, campaign limits, and hold times.', createdAt: new Date().toISOString() },
          { id: 'bm-208', timestamp: 56, note: 'Internal audit program: risk‑based schedules, objective evidence collection, and CAPA follow‑up.', createdAt: new Date().toISOString() },
          { id: 'bm-209', timestamp: 64, note: 'Training and qualification: role‑based curricula, effectiveness checks, and retraining triggers.', createdAt: new Date().toISOString() },
          { id: 'bm-210', timestamp: 72, note: 'APR/PQR trending: yield, deviations, complaints; management review inputs for continuous improvement.', createdAt: new Date().toISOString() }
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
      },
      {
        id: 'sec-016',
        type: 'scenario',
        title: 'Data Integrity Review',
        content: 'Evaluate a case where audit trail reveals backdated entries. Determine compliance issues and remediation.',
        duration: 30,
        interaction: {
          question: 'Audit trail shows manual time stamp edits to align with batch timing. What is your primary concern?',
          options: [
            'Throughput constraints',
            'ALCOA+ violation indicating potential record falsification',
            'User training gap only',
            'No concern if intent was good'
          ],
          correctIndex: 1,
          rationale: 'Backdating can violate ALCOA+ principles (Contemporaneous/Accurate) and indicates potential data integrity failures needing root cause and CAPA.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-003',
        title: 'GMP Certification Exam',
        type: 'final',
        questions: [
          {
            id: 'q-gmp-1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'A key objective of G M P is to…',
            options: [
              'Minimize production costs',
              'Consistently produce products meeting quality standards',
              'Avoid supplier audits',
              'Replace QA with QC'
            ],
            correctAnswer: 'Consistently produce products meeting quality standards',
            explanation: 'G M P ensures consistent product quality and patient safety.',
            regulatoryContext: '21 C F R 210/211'
          },
          {
            id: 'q-gmp-2',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Effective CAPA requires…',
            options: ['Retraining only', 'Root cause analysis and effectiveness checks', 'More signatures', 'Larger batch size'],
            correctAnswer: 'Root cause analysis and effectiveness checks',
            explanation: 'CAPA must address root cause and verify effectiveness.',
            regulatoryContext: 'ICH Q10'
          },
          {
            id: 'q-gmp-3',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Which best reflects Good Documentation Practices (A L C O A+)?',
            options: ['Pencil notes transcribed later', 'Contemporaneous entries in controlled records', 'Backdated e-records', 'Shared logins to speed up work'],
            correctAnswer: 'Contemporaneous entries in controlled records',
            explanation: 'Records must be attributable, legible, contemporaneous, original, accurate, etc.',
            regulatoryContext: 'Data integrity guidance'
          },
          {
            id: 'q-gmp-4',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Change control should…',
            options: ['Document only critical changes', 'Assess impact and require approval prior to implementation', 'Be optional for validated systems', 'Be handled ad hoc by operators'],
            correctAnswer: 'Assess impact and require approval prior to implementation',
            explanation: 'Formal change control manages impact and approvals.',
            regulatoryContext: 'ICH Q10'
          },
          {
            id: 'q-gmp-5',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Audit trails in Part 11 systems should…',
            options: ['Be editable by admins', 'Capture who/what/when/why changes occurred', 'Be disabled in validation', 'Be purged monthly'],
            correctAnswer: 'Capture who/what/when/why changes occurred',
            explanation: 'Audit trails ensure data integrity for e-records.',
            regulatoryContext: '21 C F R Part 11'
          }
          ,
          {
            id: 'q-gmp-6',
            type: 'multi-select',
            difficulty: 'medium',
            question: 'Select elements of A L C O A+',
            options: ['Attributable','Legible','Convenient','Contemporaneous','Available'],
            correctAnswer: ['Attributable','Legible','Contemporaneous','Available'],
            explanation: 'A L C O A+ includes Attributable, Legible, Contemporaneous, Original, Accurate, plus Complete, Consistent, Enduring, and Available.',
            regulatoryContext: 'Data integrity guidance'
          },
          {
            id: 'q-gmp-7',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Supplier qualification should be…',
            options: ['One‑time only', 'Risk‑based with periodic requalification', 'Done only after deviations', 'Optional for APIs'],
            correctAnswer: 'Risk‑based with periodic requalification',
            explanation: 'Oversight is proportionate to risk with ongoing requalification.',
            regulatoryContext: 'ICH Q10 / cG M P'
          },
          {
            id: 'q-gmp-8',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Cleaning validation demonstrates…',
            options: ['Operator efficiency', 'Acceptable residue levels under defined conditions', 'Shorter changeover time', 'SOP readability'],
            correctAnswer: 'Acceptable residue levels under defined conditions',
            explanation: 'Validation verifies cleaning process meets acceptance criteria.',
            regulatoryContext: 'cG M P'
          },
          {
            id: 'q-gmp-9',
            type: 'mcq',
            difficulty: 'medium',
            question: 'An effective audit trail must…',
            options: ['Allow edits to correct errors', 'Record who/what/when/why for changes', 'Be disabled when system is validated', 'Be exported and overwritten monthly'],
            correctAnswer: 'Record who/what/when/why for changes',
            explanation: 'Audit trails ensure traceability and integrity.',
            regulatoryContext: '21 C F R Part 11'
          },
          {
            id: 'q-gmp-10',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Deviation investigation should include…',
            options: ['Immediate closure', 'Root cause analysis and impact assessment', 'Only corrective actions', 'Reviewer signature only'],
            correctAnswer: 'Root cause analysis and impact assessment',
            explanation: 'Ensure appropriate CAPA and product disposition decisions.',
            regulatoryContext: 'cG M P / I C H Q10'
          }
        ],
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
          { id: 'bm-301', timestamp: 0, note: 'Agencies and scope: F D A, E M A, P M D A, M H R A, Health Canada; harmonization via I C H frameworks and where they diverge.', createdAt: new Date().toISOString() },
          { id: 'bm-302', timestamp: 10, note: 'Pathways overview: I N D / C T A → N D A / B L A / M A A; evidence expectations and timing considerations.', createdAt: new Date().toISOString() },
          { id: 'bm-303', timestamp: 20, note: 'Interactions: Type B/C meetings, Scientific Advice, parallel consultations; meeting objectives and briefing packages.', createdAt: new Date().toISOString() },
          { id: 'bm-304', timestamp: 30, note: 'Expedited programs: Breakthrough/Accelerated Approval (U S), PRIME/Conditional Approval (E U)—eligibility and obligations.', createdAt: new Date().toISOString() },
          { id: 'bm-305', timestamp: 40, note: 'C T D/e C T D: module purposes, lifecycle management, granularity, and common technical issues.', createdAt: new Date().toISOString() },
          { id: 'bm-306', timestamp: 50, note: 'Module 1 regional differences: local forms, labeling templates, pharmacovigilance system master files, device/combination impacts.', createdAt: new Date().toISOString() },
          { id: 'bm-307', timestamp: 60, note: 'Labeling alignment: core data sheet vs regional labels; justifying variations; change control and tracking across markets.', createdAt: new Date().toISOString() },
          { id: 'bm-308', timestamp: 70, note: 'Common pitfalls: insufficient pre‑meeting questions, inconsistent Module 2 summaries, and e C T D technical rejects.', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'sec-017',
        type: 'interactive',
        title: 'CTD Structure Check',
        content: 'Map submission content to CTD modules and identify region-specific items.',
        duration: 25,
        interaction: {
          question: 'Which statement is correct about the e C T D?',
          options: [
            'Module 1 is harmonized globally',
            'Modules 2–5 are generally harmonized by I C H',
            'Module 5 is administrative information',
            'There is no difference between C T D and e C T D'
          ],
          correctIndex: 1,
          rationale: 'Module 1 is region-specific; Modules 2–5 are generally harmonized under I C H guidelines.'
        }
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
        questions: [
          {
            id: 'q-reg-1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Which is generally true of the C T D?',
            options: [
              'Module 1 is harmonized',
              'Modules 2–5 are harmonized by I C H',
              'There is no difference across regions',
              'It is not used in the E U'
            ],
            correctAnswer: 'Modules 2–5 are harmonized by I C H',
            explanation: 'Module 1 is region-specific; 2–5 are harmonized.',
            regulatoryContext: 'I C H M4'
          },
          {
            id: 'q-reg-2',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Breakthrough Therapy (F D A) generally requires…',
            options: [
              'Preclinical data only',
              'Preliminary clinical evidence indicating substantial improvement',
              'An orphan designation',
              'An E U centralized procedure'
            ],
            correctAnswer: 'Preliminary clinical evidence indicating substantial improvement',
            explanation: 'Breakthrough is an expedited program with specific criteria.',
            regulatoryContext: 'F D A guidance'
          },
          {
            id: 'q-reg-3',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Scientific advice/Type B meetings are used to…',
            options: ['Negotiate pricing', 'Align on development plans and evidence expectations', 'Set inspection schedules', 'Approve final labels'],
            correctAnswer: 'Align on development plans and evidence expectations',
            explanation: 'Meetings support alignment with agencies.',
            regulatoryContext: 'FDA/EMA procedures'
          },
          {
            id: 'q-reg-4',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Which statement about labeling alignment across regions is true?',
            options: [
              'Labels must be identical globally',
              'Regional differences can exist due to local regulations and evidence standards',
              'Only the U S label matters',
              'CMC differences are unrelated to labeling'
            ],
            correctAnswer: 'Regional differences can exist due to local regulations and evidence standards',
            explanation: 'Harmonization exists but regional specifics remain.',
            regulatoryContext: 'Global regulatory practice'
          },
          {
            id: 'q-reg-5',
            type: 'mcq',
            difficulty: 'medium',
            question: 'e C T D primarily refers to…',
            options: ['A regulatory pathway', 'An electronic format for the C T D', 'An expedited program', 'A module for quality data only'],
            correctAnswer: 'An electronic format for the C T D',
            explanation: 'e C T D is the electronic submission format.',
            regulatoryContext: 'I C H/Regional guidance'
          }
          ,
          {
            id: 'q-reg-6',
            type: 'multi-select',
            difficulty: 'medium',
            question: 'Select C T D Modules generally harmonized by I C H:',
            options: ['Module 1','Module 2','Module 3','Module 4','Module 5'],
            correctAnswer: ['Module 2','Module 3','Module 4','Module 5'],
            explanation: 'Module 1 is region‑specific; Modules 2–5 are harmonized.',
            regulatoryContext: 'I C H M4'
          },
          {
            id: 'q-reg-7',
            type: 'mcq',
            difficulty: 'medium',
            question: 'P R I M E (E M A) is intended to…',
            options: ['Accelerate all products', 'Support medicines of major public health interest', 'Replace scientific advice', 'Eliminate inspections'],
            correctAnswer: 'Support medicines of major public health interest',
            explanation: 'P R I M E offers early, enhanced scientific support.',
            regulatoryContext: 'E M A P R I M E'
          },
          {
            id: 'q-reg-8',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Which meeting type typically aligns development plans with F D A?',
            options: ['Type A emergency meeting','Type B (e.g., E O P 2, Pre‑N D A)','Type C only','Advisory Committee'],
            correctAnswer: 'Type B (e.g., E O P 2, Pre‑N D A)',
            explanation: 'Type B meetings include critical milestones like E O P 2 and Pre‑N D A.',
            regulatoryContext: 'F D A meetings guidance'
          },
          {
            id: 'q-reg-9',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Regional Module 1 differences may include…',
            options: ['Quality summaries', 'Administrative forms and labeling specifics', 'Nonclinical reports', 'Clinical study reports'],
            correctAnswer: 'Administrative forms and labeling specifics',
            explanation: 'Module 1 contains region‑specific administrative and labeling components.',
            regulatoryContext: 'Regional Module 1'
          },
          {
            id: 'q-reg-10',
            type: 'mcq',
            difficulty: 'easy',
            question: 'e C T D primarily describes…',
            options: ['Electronic submission format', 'Pharmacovigilance plan', 'Inspection schedule', 'Budget templates'],
            correctAnswer: 'Electronic submission format',
            explanation: 'Electronic format of the C T D for regional submissions.',
            regulatoryContext: 'I C H/Regional guidance'
          }
        ],
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
          { id: 'bm-401', timestamp: 0, note: 'QA role: independent oversight, risk‑based planning, and continuous improvement; separation from operations.', createdAt: new Date().toISOString() },
          { id: 'bm-402', timestamp: 8, note: 'SOP governance: authoring, review/approval, version control, training, and effectiveness checks.', createdAt: new Date().toISOString() },
          { id: 'bm-403', timestamp: 16, note: 'Audit program: risk assessment, annual plan, scope/sampling, auditor independence/qualification, reporting timelines.', createdAt: new Date().toISOString() },
          { id: 'bm-404', timestamp: 24, note: 'Vendor oversight: qualification, quality agreements, audit/monitoring, KPI reviews, and escalation routes.', createdAt: new Date().toISOString() },
          { id: 'bm-405', timestamp: 32, note: 'TMF quality: completeness, timeliness, indexing/metadata, periodic QC, inspection‑readiness binders.', createdAt: new Date().toISOString() },
          { id: 'bm-406', timestamp: 40, note: 'Data integrity checks: ALCOA+, audit trail review strategy, user access management, periodic assessments.', createdAt: new Date().toISOString() },
          { id: 'bm-407', timestamp: 48, note: 'Issue management: grading of findings (Critical/Major/Minor), deviation linkage, and cross‑functional CAPA.', createdAt: new Date().toISOString() },
          { id: 'bm-408', timestamp: 56, note: 'CAPA system: root cause analysis, action plans, owners/due dates, effectiveness verification criteria.', createdAt: new Date().toISOString() },
          { id: 'bm-409', timestamp: 64, note: 'Management review: trending, systemic issues, resourcing, and improvement actions; QA metrics dashboard.', createdAt: new Date().toISOString() },
          { id: 'bm-410', timestamp: 72, note: 'Regulatory expectations: I C H E6(R2), M H R A/EMA inspection themes; common pitfalls and remediation.', createdAt: new Date().toISOString() }
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
      },
      {
        id: 'sec-018',
        type: 'scenario',
        title: 'Audit Trending Decision',
        content: 'Determine escalation when repeated Minor findings suggest a systemic issue across sites.',
        duration: 20,
        interaction: {
          question: 'Three consecutive audits found missing investigator signatures (Minor). What is the appropriate program-level action?',
          options: [
            'No action; still Minor',
            'Raise to Major trend and implement CAPA across sites',
            'Classify as Critical finding immediately',
            'Switch to 100% source verification'
          ],
          correctIndex: 1,
          rationale: 'Trending of repeated similar Minors can indicate a systemic issue; address with program-level CAPA and oversight.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-005',
        title: 'QA Competency Assessment',
        type: 'final',
        questions: [
          {
            id: 'q-qa-1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Quality Assurance primarily provides…',
            options: ['Operational execution', 'Independent oversight and continuous improvement', 'Manufacturing controls', 'Marketing approvals'],
            correctAnswer: 'Independent oversight and continuous improvement',
            explanation: 'QA is distinct from operations and QC.',
            regulatoryContext: 'I C H E6(R2)/ISO 9001 principles'
          },
          {
            id: 'q-qa-2',
            type: 'mcq',
            difficulty: 'medium',
            question: 'A risk‑based audit program should…',
            options: ['Sample everything equally', 'Prioritize areas critical to quality and subject safety/data integrity', 'Eliminate vendor audits', 'Be fixed annually without change'],
            correctAnswer: 'Prioritize areas critical to quality and subject safety/data integrity',
            explanation: 'Risk-based approach targets critical processes and vendors.',
            regulatoryContext: 'I C H E6(R2) 5.19'
          },
          {
            id: 'q-qa-3',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Which best describes Minor vs Major findings?',
            options: ['Minor: systemic failure; Major: isolated documentation gap', 'Minor: limited impact; Major: potential impact on subject safety/data integrity', 'Minor: no documentation; Major: cosmetic issue', 'No difference'],
            correctAnswer: 'Minor: limited impact; Major: potential impact on subject safety/data integrity',
            explanation: 'Classification reflects impact and risk.',
            regulatoryContext: 'Audit practice'
          },
          {
            id: 'q-qa-4',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Vendor oversight should include…',
            options: ['Initial qualification only', 'Risk‑based ongoing monitoring and periodic audits', 'Self‑certification by vendor only', 'Not applicable for computerized systems'],
            correctAnswer: 'Risk‑based ongoing monitoring and periodic audits',
            explanation: 'Oversight is continuous and proportionate.',
            regulatoryContext: 'I C H E6(R2) vendor oversight'
          },
          {
            id: 'q-qa-5',
            type: 'mcq',
            difficulty: 'medium',
            question: 'T M F quality should ensure that documents are…',
            options: ['Archived only after inspection', 'Complete, contemporaneous, retrievable', 'Editable by all users', 'Summarized quarterly'],
            correctAnswer: 'Complete, contemporaneous, retrievable',
            explanation: 'T M F must demonstrate compliance and enable reconstruction.',
            regulatoryContext: 'I C H E6(R2) 8'
          }
          ,
          {
            id: 'q-qa-6',
            type: 'multi-select',
            difficulty: 'medium',
            question: 'A risk‑based audit program should include…',
            options: ['Defined risk criteria','Sampling strategy','Independence of auditors','Only announced audits'],
            correctAnswer: ['Defined risk criteria','Sampling strategy','Independence of auditors'],
            explanation: 'Risk criteria, sampling, and independence are foundational; unannounced may be used but not exclusively.',
            regulatoryContext: 'I C H E6(R2) 5.19 / ISO 9001 principles'
          },
          {
            id: 'q-qa-7',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Issue management should…',
            options: ['Avoid trending to reduce false alarms','Include categorization, root cause, CAPA, and effectiveness check','Focus only on documentation errors','Be optional for vendors'],
            correctAnswer: 'Include categorization, root cause, CAPA, and effectiveness check',
            explanation: 'Structured issue management underpins continual improvement.',
            regulatoryContext: 'QA practice'
          },
          {
            id: 'q-qa-8',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Vendor oversight should be…',
            options: ['Documented at qualification only','Risk‑based and continuous, including performance review','Delegated entirely to Procurement','Suspended during study close‑out'],
            correctAnswer: 'Risk‑based and continuous, including performance review',
            explanation: 'Ongoing oversight ensures continued suitability and compliance.',
            regulatoryContext: 'I C H E6(R2) vendor oversight'
          },
          {
            id: 'q-qa-9',
            type: 'mcq',
            difficulty: 'medium',
            question: 'A Minor finding typically indicates…',
            options: ['Systemic risk to subject safety/data integrity','Limited impact, but may trend to Major if repeated','No need for CAPA','Immediate critical escalation'],
            correctAnswer: 'Limited impact, but may trend to Major if repeated',
            explanation: 'Trending informs escalation and systemic CAPA.',
            regulatoryContext: 'Audit practice'
          },
          {
            id: 'q-qa-10',
            type: 'mcq',
            difficulty: 'easy',
            question: 'T M F should allow…',
            options: ['Reconstruction of trial conduct','Deletion of drafts after approval','Edits without audit trail','Site‑only storage without sponsor access'],
            correctAnswer: 'Reconstruction of trial conduct',
            explanation: 'T M F demonstrates compliance and enables reconstruction.',
            regulatoryContext: 'I C H E6(R2) 8'
          }
        ],
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
  ,
  {
    id: 'mod-006',
    title: 'Clinical Operations Excellence',
    description: 'Operational planning and execution of clinical trials: feasibility, site selection, monitoring, TMF, vendor oversight, RBM, and inspection readiness.',
    domain: 'clinical-operations',
    duration: 300,
    difficulty: 'intermediate',
    prerequisites: ['mod-001'],
    content: [
      {
        id: 'sec-019',
        type: 'video',
        title: 'Core Clinical Operations',
        content: 'End-to-end trial operations from protocol operationalization and feasibility to site activation, monitoring, data flow, and closeout. Emphasis on risk-based execution and inspection-readiness.',
        duration: 60,
        transcript: 'Clinical Operations translates clinical strategy into executable plans. Key components include feasibility and site selection, vendor/CRO oversight, monitoring strategy (on-site/remote/centralized), source data review/verification, informed consent execution, protocol deviation handling, SAE/AE flow coordination with PV, TMF completeness and timeliness, and inspection readiness. Risk-based approaches target critical-to-quality factors and leverage centralized monitoring to focus on impactful issues.',
        bookmarks: [
          { id: 'bm-501', timestamp: 0, note: 'Protocol operationalization: define C T Q factors; align schedule of activities, endpoints, and data flow.', createdAt: new Date().toISOString() },
          { id: 'bm-502', timestamp: 8, note: 'Feasibility/site selection: country/start-up timelines, patient pool, competing trials, site past performance/quality.', createdAt: new Date().toISOString() },
          { id: 'bm-503', timestamp: 16, note: 'Study start-up: start-up package, essential documents, I R B / I E C approvals, greenlight checklists.', createdAt: new Date().toISOString() },
          { id: 'bm-504', timestamp: 24, note: 'Monitoring plan: risk‑based strategy, visit cadence, centralized analytics, triggers (K R I / Q T L).', createdAt: new Date().toISOString() },
          { id: 'bm-505', timestamp: 32, note: 'S D R vs S D V: what to review vs verify; target critical data and processes to reduce error and burden.', createdAt: new Date().toISOString() },
          { id: 'bm-506', timestamp: 40, note: 'Informed consent execution: process controls, versioning, re‑consent triggers, documentation expectations.', createdAt: new Date().toISOString() },
          { id: 'bm-507', timestamp: 48, note: 'Deviation management: detect, classify, assess impact, remediate; escalation and CAPA linkage where systemic.', createdAt: new Date().toISOString() },
          { id: 'bm-508', timestamp: 56, note: 'SAE/AE flow: timely reporting pathways, reconciliation with PV, data consistency checks.', createdAt: new Date().toISOString() },
          { id: 'bm-509', timestamp: 64, note: 'TMF management: filing structure, completeness/timeliness QC, e T M F access controls and audit trails.', createdAt: new Date().toISOString() },
          { id: 'bm-510', timestamp: 72, note: 'Inspection readiness: story of the trial, key risks/mitigations, pre‑inspection checks, interview preparation.', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'sec-020',
        type: 'interactive',
        title: 'Monitoring Triage Exercise',
        content: 'Prioritize monitoring focus areas based on K R I movement and site performance signals.',
        duration: 30,
        interaction: {
          question: 'A site’s K R I shows rising query aging and delayed S A E follow‑ups. What is the best immediate action?',
          options: [
            'Increase S D V to 100% across all data',
            'Targeted on‑site/remote review focusing on S A E reconciliation and data queries',
            'Close the site until resolved',
            'No action until next routine visit'
          ],
          correctIndex: 1,
          rationale: 'Risk‑based monitoring targets critical signals with focused review and follow‑up, rather than blanket 100% S D V or inaction.'
        }
      },
      {
        id: 'sec-021',
        type: 'scenario',
        title: 'Consent Version Control Case',
        content: 'A site used an outdated consent form for two subjects after an amendment. Determine remediation and reporting.',
        duration: 25,
        interaction: {
          question: 'Which is the most compliant remediation?',
          options: [
            'Backdate new consents to original dates',
            'Obtain re‑consent with correct version, assess impact, and document deviation/C A P A',
            'Ignore because no safety impact',
            'Ask sponsor to waive consent'
          ],
          correctIndex: 1,
          rationale: 'Re‑consent with the correct version and deviation documentation/impact assessment are required; backdating is non‑compliant.'
        }
      }
    ],
    assessments: [
      {
        id: 'assess-006',
        title: 'Clinical Operations Assessment',
        type: 'final',
        questions: [
          { id: 'q-co-1', type: 'mcq', difficulty: 'easy', question: 'Risk‑based monitoring aims to…', options: ['Eliminate monitoring', 'Focus on C T Q and key risks', 'Ensure 100% S D V', 'Replace site visits entirely'], correctAnswer: 'Focus on C T Q and key risks', explanation: 'RBM targets critical‑to‑quality factors via proportionate oversight.', regulatoryContext: 'I C H E6(R2) / I C H E8(R1) / F D A RBM Guidance' },
          { id: 'q-co-2', type: 'mcq', difficulty: 'medium', question: 'S D R vs S D V refers to…', options: ['Review vs Verify of source data', 'Sponsor vs Site roles', 'Risk vs Quality', 'Audit vs Inspection'], correctAnswer: 'Review vs Verify of source data', explanation: 'S D R examines source for quality; S D V verifies transcription to CRF/eCRF.', regulatoryContext: 'Industry practice / I C H' },
          { id: 'q-co-3', type: 'mcq', difficulty: 'medium', question: 'A K R I spike in query aging suggests…', options: ['Strong performance', 'Potential site management/data entry issues', 'No action needed', 'Protocol misalignment only'], correctAnswer: 'Potential site management/data entry issues', explanation: 'Aging queries can indicate inadequate follow‑up or staffing; triage accordingly.', regulatoryContext: 'RBM analytics' },
          { id: 'q-co-4', type: 'mcq', difficulty: 'hard', question: 'Which control supports consent version management?', options: ['Uncontrolled templates', 'Delegation logs only', 'Greenlight checklist verifying current I C F version and training', '100% S D V of labs only'], correctAnswer: 'Greenlight checklist verifying current I C F version and training', explanation: 'Start‑up controls prevent outdated I C F usage.', regulatoryContext: 'I C H E6 / operational controls' },
          { id: 'q-co-5', type: 'mcq', difficulty: 'medium', question: 'Effective T M F management requires…', options: ['Filing at closeout', 'Timely filing, completeness checks, and controlled access', 'Only paper copies', 'No audit trails'], correctAnswer: 'Timely filing, completeness checks, and controlled access', explanation: 'e T M F requires timely, complete, controlled records.', regulatoryContext: 'Inspection expectations' },
          { id: 'q-co-6', type: 'multi-select', difficulty: 'medium', question: 'Select examples of C T Q processes', options: ['Consent process', 'Primary endpoint assessments', 'Travel booking', 'S A E reporting'], correctAnswer: ['Consent process','Primary endpoint assessments','S A E reporting'], explanation: 'C T Q focuses on participant protection and data criticality.', regulatoryContext: 'I C H E8(R1)' }
        ],
        passingScore: 80,
        timeLimit: 60,
        adaptive: false
      }
    ],
    certification: true,
    version: '1.0',
    status: 'published',
    createdBy: 'admin-003',
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    regulatoryReferences: [
      { authority: 'ICH', document: 'E8(R1) General Considerations for Clinical Studies', section: 'All', effectiveDate: '2019-12-06', url: 'https://www.ich.org/page/efficacy-guidelines' },
      { authority: 'ICH', document: 'E6(R2) Good Clinical Practice', section: 'All', effectiveDate: '2016-11-09', url: 'https://database.ich.org/sites/default/files/E6_R2_Addendum.pdf' },
      { authority: 'FDA', document: 'Risk-Based Monitoring Guidance', section: 'All', effectiveDate: '2013-08-13', url: 'https://www.fda.gov/media/116754/download' },
      { authority: 'EMA', document: 'Reflection paper on risk-based quality management', section: 'All', effectiveDate: '2013-11-18', url: 'https://www.ema.europa.eu/en/documents/scientific-guideline/reflection-paper-risk-based-quality-management-clinical-trials_en.pdf' }
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