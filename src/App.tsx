import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/AppLayout'
import { DashboardView } from '@/components/views/DashboardView'
import { LearningView } from '@/components/views/LearningView'
import { ModuleViewer } from '@/components/views/ModuleViewer'
import { AssessmentView } from '@/components/views/AssessmentView'
import { AssessmentsView } from '@/components/views/AssessmentsView'
import { GlossaryView } from '@/components/views/GlossaryView'
import { AnalyticsView } from '@/components/views/AnalyticsView'
import { CertificationsView } from '@/components/views/CertificationsView'
import { ContentManagementView } from '@/components/views/ContentManagementView'
import { AIContentReviewView } from '@/components/views/AIContentReviewView'
import { AIHealthView } from './components/views/AIHealthView'
import { AssessmentsView } from '@/components/views/AssessmentsView'
import { GlossaryView } from '@/components/views/GlossaryView'
import type { UserProgress, Certification, AssessmentResult, DraftContent, AuditLogEntry } from '@/lib/types'
import {
  MOCK_MODULES,
  MOCK_USER_PROGRESS,
  MOCK_CERTIFICATIONS,
  MOCK_DRAFT_CONTENT,
  MOCK_LEARNER_METRICS,
  MOCK_MODULE_METRICS,
  MOCK_AUDIT_LOG,
} from '@/lib/mockData'
import { isDuplicateDraft, startRegwatchPolling } from '@/lib/ai/regwatch'
import { generateCertificateCode } from '@/lib/helpers'
import { toast } from 'sonner'
import { buildAuditEntry } from '@/lib/audit'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [assessmentMode, setAssessmentMode] = useState<{
    moduleId: string
    assessmentId: string
  } | null>(null)

  const [userProgress, setUserProgress] = useKV<UserProgress[]>('user-progress', MOCK_USER_PROGRESS)
  const [certifications, setCertifications] = useKV<Certification[]>('certifications', MOCK_CERTIFICATIONS)
  const [draftContent, setDraftContent] = useKV<DraftContent[]>('draft-content', MOCK_DRAFT_CONTENT)
  const [auditLog, setAuditLog] = useKV<AuditLogEntry[]>('audit-log', MOCK_AUDIT_LOG)
  const [regwatchActive, setRegwatchActive] = useKV<boolean>('regwatch-active', false)
  const stopRegwatchRef = useRef<null | (() => void)>(null)

  const userRole = 'admin'
  const userName = 'Current User'
  const userId = 'user-001'

  const safeUserProgress = userProgress || []
  const safeCertifications = certifications || []
  const safeDrafts = draftContent || []

  const PAGE_LABELS: Record<string, string> = {
    'dashboard': 'Dashboard',
    'learning': 'My Learning',
    'module-viewer': 'Module Viewer',
    'assessment': 'Assessment',
    'assessments': 'Assessments',
    'analytics': 'Analytics',
    'certifications': 'Certifications',
    'glossary': 'Glossary',
    'content-management': 'Content Management',
    'ai-content': 'AI Content Review',
    'ai-health': 'AI Health',
  }

  const handleNavigate = (view: string, moduleId?: string) => {
    const prevView = currentView
    const pageName = PAGE_LABELS[view] || view
    const prevPageName = PAGE_LABELS[prevView] || prevView
    const details: Record<string, unknown> = {
      pageId: view,
      pageName,
      prevPageId: prevView,
      prevPageName,
    }
    if (moduleId) {
      const module = MOCK_MODULES.find(m => m.id === moduleId)
      details.moduleId = moduleId
      if (module?.title) details.moduleTitle = module.title
    }
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'NAVIGATE',
        resource: 'ui_view',
        resourceId: view,
        details,
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
    setCurrentView(view)
    if (moduleId) {
      setSelectedModuleId(moduleId)
      if (view === 'module-viewer') {
        ensureProgressExists(moduleId)
      }
    } else {
      setSelectedModuleId(null)
    }
    setAssessmentMode(null)
  }

  const ensureProgressExists = (moduleId: string) => {
    setUserProgress(current => {
      const currentProgress = current || []
      const exists = currentProgress.some(p => p.moduleId === moduleId)
      if (!exists) {
        const newProgress: UserProgress = {
          userId,
          moduleId,
          status: 'in-progress',
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
            recommendedDifficulty: 'medium',
          },
        }
        return [...currentProgress, newProgress]
      }
      return currentProgress
    })
  }

  const handleUpdateProgress = (moduleId: string, updates: Partial<UserProgress>) => {
    setUserProgress(current =>
      (current || []).map(p =>
        p.moduleId === moduleId
          ? { ...p, ...updates, lastAccessed: new Date().toISOString() }
          : p
      )
    )
    if (typeof updates.currentSection === 'number') {
      ;(async () => {
        const entry = await buildAuditEntry({
          userId,
          userName,
          actorRole: userRole,
          origin: 'ui',
          action: 'SECTION_PROGRESS',
          resource: 'learning_module',
          resourceId: moduleId,
          details: { currentSection: updates.currentSection, progress: updates.progress },
        }, (auditLog || []).slice(-1)[0])
        setAuditLog((cur) => ([...(cur || []), entry]))
      })()
    }
  }

  const handleStartAssessment = (moduleId: string, assessmentId: string) => {
    setAssessmentMode({ moduleId, assessmentId })
    setCurrentView('assessment')
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'ASSESSMENT_STARTED',
        resource: 'assessment',
        resourceId: assessmentId,
        details: { moduleId },
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }

  const handleCompleteAssessment = (moduleId: string, result: AssessmentResult) => {
    setUserProgress(current =>
      (current || []).map(p => {
        if (p.moduleId === moduleId) {
          const updatedResults = [...p.assessmentResults, result]
          return {
            ...p,
            assessmentResults: updatedResults,
            status: result.passed ? 'completed' : 'in-progress',
            progress: result.passed ? 100 : p.progress,
          }
        }
        return p
      })
    )

    if (result.passed) {
      const module = MOCK_MODULES.find(m => m.id === moduleId)
      if (module?.certification) {
        const newCert: Certification = {
          id: `cert-${Date.now()}`,
          moduleId: moduleId,
          moduleName: module.title,
          issuedDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          certificateUrl: `/certificates/cert-${Date.now()}.pdf`,
          verificationCode: generateCertificateCode(),
          status: 'active',
        }
        setCertifications(current => [...(current || []), newCert])
        toast.success('Certification earned!')
        ;(async () => {
          const entry = await buildAuditEntry({
            userId,
            userName,
            actorRole: userRole,
            origin: 'ui',
            action: 'CERTIFICATION_ISSUED',
            resource: 'certification',
            resourceId: newCert.id,
            details: { moduleId, moduleName: module.title },
          }, (auditLog || []).slice(-1)[0])
          setAuditLog((cur) => ([...(cur || []), entry]))
        })()
      }
    }

    setAssessmentMode(null)
  }

  // AI content review handlers
  const handleDraftApprove = (draftId: string, reviewComment?: string) => {
    if (userRole !== 'admin') { toast.error('Admin only action'); return }
    setDraftContent((current) => {
      const drafts = (current || []) as DraftContent[]
      return drafts.map(d => d.id === draftId ? {
        ...d,
        status: 'approved',
        reviewedBy: 'admin-001',
        reviewedAt: new Date().toISOString(),
        comments: reviewComment ? [...(d.comments || []), reviewComment] : d.comments,
      } : d)
    })
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'CONTENT_APPROVED',
        resource: 'draft_content',
        resourceId: draftId,
        details: { reviewComment },
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }
  const handleDraftReject = (draftId: string, reviewComment: string) => {
    if (userRole !== 'admin') { toast.error('Admin only action'); return }
    setDraftContent((current) => {
      const drafts = (current || []) as DraftContent[]
      return drafts.map(d => d.id === draftId ? {
        ...d,
        status: 'archived',
        comments: reviewComment ? [...(d.comments || []), `Rejected: ${reviewComment}`] : d.comments,
      } : d)
    })
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'CONTENT_REJECTED',
        resource: 'draft_content',
        resourceId: draftId,
        details: { reviewComment },
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }
  const handleDraftRequestRevision = (draftId: string, reviewComment: string) => {
    if (userRole !== 'admin') { toast.error('Admin only action'); return }
    setDraftContent((current) => {
      const drafts = (current || []) as DraftContent[]
      return drafts.map(d => d.id === draftId ? {
        ...d,
        status: 'pending-review',
        comments: reviewComment ? [...(d.comments || []), `Revision requested: ${reviewComment}`] : d.comments,
      } : d)
    })
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'CONTENT_REVISION_REQUESTED',
        resource: 'draft_content',
        resourceId: draftId,
        details: { reviewComment },
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }
  const handleProposeDraft = (draft: DraftContent) => {
    setDraftContent((current) => {
      const existing = (current || []) as DraftContent[]
      if (isDuplicateDraft(existing, draft)) {
        toast.message('Duplicate proposal ignored', { description: 'An identical update is already under review.' })
        return existing
      }
      return [...existing, draft]
    })
    ;(async () => {
      const entry = await buildAuditEntry({
        userId: 'ai-agent',
        userName: 'RegWatch AI',
        actorRole: 'system',
        origin: 'ai',
        action: 'CONTENT_PROPOSED',
        resource: 'draft_content',
        resourceId: draft.id,
        details: { moduleId: draft.moduleId, authority: draft.regulatoryTrigger.authority },
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }

  const handleAuthorizeAgenticUpdate = (draftId: string) => {
    if (userRole !== 'admin') { toast.error('Admin only action'); return }
    setDraftContent((current) => {
      const drafts = (current || []) as DraftContent[]
      return drafts.map(d => d.id === draftId ? {
        ...d,
        agenticAuthorized: true,
        comments: [...(d.comments || []), 'Agentic AI update authorized by approver'],
      } : d)
    })
    toast.success('Agentic AI update authorized')
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'AGENTIC_UPDATE_AUTHORIZED',
        resource: 'draft_content',
        resourceId: draftId,
        details: {},
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }

  // Ensure regwatch runs/stops based on persisted state
  useEffect(() => {
    if (regwatchActive) {
      if (!stopRegwatchRef.current) {
        stopRegwatchRef.current = startRegwatchPolling(
          MOCK_MODULES.map(m => ({ id: m.id, domain: m.domain })),
          (draft) => handleProposeDraft(draft),
          20000,
        )
      }
    } else {
      if (stopRegwatchRef.current) {
        stopRegwatchRef.current()
        stopRegwatchRef.current = null
      }
    }
    return () => {
      if (stopRegwatchRef.current) {
        stopRegwatchRef.current()
        stopRegwatchRef.current = null
      }
    }
  }, [regwatchActive])

  const onStartPolling = () => {
    setRegwatchActive(true)
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'REGWATCH_START',
        resource: 'ai_proposals',
        resourceId: 'regwatch',
        details: {},
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }
  const onStopPolling = () => {
    setRegwatchActive(false)
    ;(async () => {
      const entry = await buildAuditEntry({
        userId,
        userName,
        actorRole: userRole,
        origin: 'ui',
        action: 'REGWATCH_STOP',
        resource: 'ai_proposals',
        resourceId: 'regwatch',
        details: {},
      }, (auditLog || []).slice(-1)[0])
      setAuditLog((cur) => ([...(cur || []), entry]))
    })()
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            modules={MOCK_MODULES}
            progress={safeUserProgress}
            certifications={safeCertifications}
            onNavigate={handleNavigate}
          />
        )

      case 'learning':
        return (
          <LearningView
            modules={MOCK_MODULES}
            progress={safeUserProgress}
            onNavigate={handleNavigate}
          />
        )

      case 'module-viewer':
        if (!selectedModuleId) {
          handleNavigate('learning')
          return null
        }
        const module = MOCK_MODULES.find(m => m.id === selectedModuleId)
        const moduleProgress = safeUserProgress.find(p => p.moduleId === selectedModuleId)
        if (!module || !moduleProgress) {
          handleNavigate('learning')
          return null
        }
        return (
          <ModuleViewer
            module={module}
            progress={moduleProgress}
            onNavigate={handleNavigate}
            onUpdateProgress={(updates) => handleUpdateProgress(selectedModuleId, updates)}
            onStartAssessment={handleStartAssessment}
          />
        )

      case 'assessment':
        if (!assessmentMode) {
          handleNavigate('learning')
          return null
        }
        const assessmentModule = MOCK_MODULES.find(m => m.id === assessmentMode.moduleId)
        const assessment = assessmentModule?.assessments.find(a => a.id === assessmentMode.assessmentId)
        if (!assessmentModule || !assessment) {
          handleNavigate('learning')
          return null
        }
        return (
          <AssessmentView
            moduleId={assessmentMode.moduleId}
            moduleName={assessmentModule.title}
            assessment={assessment}
            onComplete={(result) => handleCompleteAssessment(assessmentMode.moduleId, result)}
            onNavigate={handleNavigate}
          />
        )

      case 'assessments':
        return (
          <AssessmentsView
            modules={MOCK_MODULES}
            progress={safeUserProgress}
            onStartAssessment={handleStartAssessment}
          />
        )

      case 'glossary':
        return <GlossaryView />

      case 'analytics':
        return (
          <AnalyticsView
            progress={safeUserProgress}
            learnerMetrics={MOCK_LEARNER_METRICS}
            moduleMetrics={MOCK_MODULE_METRICS}
          />
        )

      case 'assessments':
        return (
          <AssessmentsView
            modules={MOCK_MODULES}
            progress={safeUserProgress}
            onStartAssessment={handleStartAssessment}
          />
        )

      case 'glossary':
        return (
          <GlossaryView />
        )

      case 'certifications':
        return (
          <CertificationsView
            certifications={safeCertifications}
            onNavigate={handleNavigate}
            userName={userName}
          />
        )

      case 'content-management':
        return (
          <ContentManagementView
            modules={MOCK_MODULES}
            auditLog={auditLog || []}
          />
        )

      case 'ai-content':
        return (
          <AIContentReviewView
            draftContent={safeDrafts}
            modulesLite={MOCK_MODULES.map(m => ({ id: m.id, domain: m.domain }))}
            onApprove={handleDraftApprove}
            onReject={handleDraftReject}
            onRequestRevision={handleDraftRequestRevision}
            onProposeDraft={handleProposeDraft}
            onAuthorizeAgenticUpdate={handleAuthorizeAgenticUpdate}
            pollingActive={regwatchActive || false}
            onStartPolling={onStartPolling}
            onStopPolling={onStopPolling}
          />
        )
      case 'ai-health':
        return (
          <AIHealthView />
        )

      default:
        return (
          <DashboardView
            modules={MOCK_MODULES}
            progress={safeUserProgress}
            certifications={safeCertifications}
            onNavigate={handleNavigate}
          />
        )
    }
  }

  return (
    <>
      <AppLayout
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
        userName={userName}
      >
        {renderView()}
      </AppLayout>
      <Toaster position="top-right" />
    </>
  )
}

export default App