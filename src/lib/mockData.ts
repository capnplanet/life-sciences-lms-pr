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
          { id: 'bm-004', timestamp: 30, note: 'Risk‑based quality management and vendor oversight per ICH E6(R2)/(R3) direction.', createdAt: new Date().toISOString() },
          { id: 'bm-005', timestamp: 40, note: 'Essential documents and TMF: contemporaneous, complete, retrievable.', createdAt: new Date().toISOString() },
          { id: 'bm-006', timestamp: 50, note: 'Monitoring approaches: centralized vs on‑site, proportionate to risk.', createdAt: new Date().toISOString() },
          { id: 'bm-007', timestamp: 60, note: 'Investigator responsibilities and adequate resources (I C H E6 4.1).', createdAt: new Date().toISOString() }
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
        transcript: 'Pharmacovigilance ensures that the benefit‑risk profile of medicinal products remains positive throughout their lifecycle. Core processes include intake and processing of individual case safety reports, medical coding (MedDRA), causality and seriousness assessment, expedited and periodic reporting, and signal management. Data sources include spontaneous reports, literature, studies and registries, EHR/claims, and social media (with caution). Signal detection combines quantitative methods with medical judgment per GVP Module IX.',
        bookmarks: [
          { id: 'bm-101', timestamp: 0, note: 'PV purpose: maintain positive benefit‑risk across the product lifecycle.', createdAt: new Date().toISOString() },
          { id: 'bm-102', timestamp: 12, note: 'ICSR processing: case intake → coding → assessment → reporting obligations.', createdAt: new Date().toISOString() },
          { id: 'bm-103', timestamp: 24, note: 'Data sources: spontaneous, literature, clinical, real‑world (EHR/claims).', createdAt: new Date().toISOString() },
          { id: 'bm-104', timestamp: 36, note: 'Signal detection: disproportionality + clinical review per GVP IX.', createdAt: new Date().toISOString() },
          { id: 'bm-105', timestamp: 44, note: 'Periodic reporting: PBRER/PSUR—aggregate safety evaluation.', createdAt: new Date().toISOString() },
          { id: 'bm-106', timestamp: 54, note: 'Roles: Q P P V and safety governance.', createdAt: new Date().toISOString() }
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
          { id: 'bm-201', timestamp: 0, note: 'GMP objective and link to patient safety and product quality.', createdAt: new Date().toISOString() },
          { id: 'bm-202', timestamp: 14, note: 'Quality System elements: SOPs, records, training, change control.', createdAt: new Date().toISOString() },
          { id: 'bm-203', timestamp: 28, note: 'Deviation/CAPA lifecycle and effectiveness checks.', createdAt: new Date().toISOString() },
          { id: 'bm-204', timestamp: 42, note: 'Supplier qualification and internal audits to ensure control.', createdAt: new Date().toISOString() },
          { id: 'bm-205', timestamp: 52, note: 'Data integrity and ALCOA+ expectations under 21 C F R Part 211.', createdAt: new Date().toISOString() },
          { id: 'bm-206', timestamp: 62, note: 'Cleaning validation and cross‑contamination prevention overview.', createdAt: new Date().toISOString() }
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
          { id: 'bm-301', timestamp: 0, note: 'Agencies and harmonization: FDA, EMA, PMDA, MHRA, Health Canada; role of ICH.', createdAt: new Date().toISOString() },
          { id: 'bm-302', timestamp: 18, note: 'Regulatory pathways: IND/CTA → NDA/BLA/MAA; scientific advice and meetings.', createdAt: new Date().toISOString() },
          { id: 'bm-303', timestamp: 36, note: 'Expedited programs and criteria (Breakthrough, PRIME).', createdAt: new Date().toISOString() },
          { id: 'bm-304', timestamp: 52, note: 'e C T D structure and regional Module 1 differences.', createdAt: new Date().toISOString() },
          { id: 'bm-305', timestamp: 62, note: 'Labeling alignment and regional variations.', createdAt: new Date().toISOString() }
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
          { id: 'bm-401', timestamp: 0, note: 'Role of QA: confidence via independent oversight and continuous improvement.', createdAt: new Date().toISOString() },
          { id: 'bm-402', timestamp: 15, note: 'Risk‑based audit program and vendor oversight.', createdAt: new Date().toISOString() },
          { id: 'bm-403', timestamp: 30, note: 'TMF quality and data integrity checks.', createdAt: new Date().toISOString() },
          { id: 'bm-404', timestamp: 45, note: 'Issue management and CAPA linkage to prevent recurrence.', createdAt: new Date().toISOString() },
          { id: 'bm-405', timestamp: 55, note: 'Vendor oversight sampling and follow‑up.', createdAt: new Date().toISOString() }
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