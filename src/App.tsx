import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/AppLayout'
import { DashboardView } from '@/components/views/DashboardView'
import { LearningView } from '@/components/views/LearningView'
import { ModuleViewer } from '@/components/views/ModuleViewer'
import { AssessmentView } from '@/components/views/AssessmentView'
import { AnalyticsView } from '@/components/views/AnalyticsView'
import { CertificationsView } from '@/components/views/CertificationsView'
import { ContentManagementView } from '@/components/views/ContentManagementView'
import { AIContentReviewView } from '@/components/views/AIContentReviewView'
import { AssessmentsView } from '@/components/views/AssessmentsView'
import type { UserProgress, Certification, AssessmentResult } from '@/lib/types'
import { 
  MOCK_MODULES, 
  MOCK_USER_PROGRESS, 
  MOCK_CERTIFICATIONS,
  MOCK_DRAFT_CONTENT,
  MOCK_LEARNER_METRICS,
  MOCK_MODULE_METRICS,
  MOCK_AUDIT_LOG
} from '@/lib/mockData'
import { generateCertificateCode } from '@/lib/helpers'
import { toast } from 'sonner'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [assessmentMode, setAssessmentMode] = useState<{
    moduleId: string
    assessmentId: string
  } | null>(null)

  const [userProgress, setUserProgress] = useKV<UserProgress[]>('user-progress', MOCK_USER_PROGRESS)
  const [certifications, setCertifications] = useKV<Certification[]>('certifications', MOCK_CERTIFICATIONS)

  const userRole = 'admin'
  const userName = 'Current User'

  const safeUserProgress = userProgress || []
  const safeCertifications = certifications || []

  const handleNavigate = (view: string, moduleId?: string) => {
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
          userId: 'user-001',
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
            recommendedDifficulty: 'medium'
          }
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
  }

  const handleStartAssessment = (moduleId: string, assessmentId: string) => {
    setAssessmentMode({ moduleId, assessmentId })
    setCurrentView('assessment')
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
            progress: result.passed ? 100 : p.progress
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
          status: 'active'
        }
        setCertifications(current => [...(current || []), newCert])
        toast.success('Certification earned!')
      }
    }

    setAssessmentMode(null)
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

      case 'analytics':
        return (
          <AnalyticsView
            progress={safeUserProgress}
            learnerMetrics={MOCK_LEARNER_METRICS}
            moduleMetrics={MOCK_MODULE_METRICS}
          />
        )

      case 'certifications':
        return (
          <CertificationsView
            certifications={safeCertifications}
            onNavigate={handleNavigate}
          />
        )

      case 'content-management':
        return (
          <ContentManagementView
            modules={MOCK_MODULES}
            auditLog={MOCK_AUDIT_LOG}
          />
        )

      case 'ai-content':
        return (
          <AIContentReviewView
            draftContent={MOCK_DRAFT_CONTENT}
          />
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