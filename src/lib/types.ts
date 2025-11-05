export type UserRole = 'learner' | 'instructor' | 'admin'

export type ModuleStatus = 'not-started' | 'in-progress' | 'completed' | 'expired'
export type AssessmentStatus = 'pending' | 'passed' | 'failed' | 'locked'
export type ContentStatus = 'draft' | 'pending-review' | 'approved' | 'published' | 'archived'

export type RegulatoryAuthority = 
  | 'FDA' | 'EMA' | 'Health Canada' | 'PMDA' | 'MHRA' | 'CDSCO' | 'ICH'

export type IndustryDomain = 
  | 'pharmacovigilance'
  | 'clinical-operations'
  | 'quality-assurance'
  | 'regulatory-affairs'
  | 'quality-control'
  | 'gmp'
  | 'gcp'
  | 'gpvp'
  | 'gmlp'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isOwner?: boolean
  enrolledCourses: string[]
  completedModules: string[]
  certifications: Certification[]
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: boolean
  emailDigest: boolean
  playbackSpeed: number
  subtitles: boolean
}

export interface LearningModule {
  id: string
  title: string
  description: string
  domain: IndustryDomain
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  content: ContentSection[]
  assessments: Assessment[]
  certification: boolean
  version: string
  status: ContentStatus
  createdBy: string
  updatedAt: string
  regulatoryReferences: RegulatoryReference[]
}

export interface ContentSection {
  id: string
  type: 'video' | 'text' | 'interactive' | 'scenario'
  title: string
  content: string
  videoUrl?: string
  duration?: number
  transcript?: string
  bookmarks?: Bookmark[]
  completed?: boolean
  interaction?: InteractionDef
}

export interface InteractionDef {
  question: string
  options: string[]
  correctIndex: number
  rationale: string
}

export interface Assessment {
  id: string
  title: string
  type: 'pre' | 'knowledge-check' | 'final'
  questions: Question[]
  passingScore: number
  timeLimit?: number
  adaptive: boolean
}

export interface Question {
  id: string
  type: 'mcq' | 'multi-select' | 'scenario' | 'drag-drop' | 'simulation'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  regulatoryContext?: string
}

export interface UserProgress {
  userId: string
  moduleId: string
  status: ModuleStatus
  progress: number
  currentSection: number
  assessmentResults: AssessmentResult[]
  timeSpent: number
  lastAccessed: string
  adaptivePath: string[]
  performanceMetrics: PerformanceMetrics
}

export interface AssessmentResult {
  assessmentId: string
  score: number
  passed: boolean
  attempts: number
  answers: UserAnswer[]
  completedAt: string
  timeSpent: number
}

export interface UserAnswer {
  questionId: string
  answer: string | string[]
  correct: boolean
  timeSpent: number
}

export interface PerformanceMetrics {
  comprehensionScore: number
  retentionScore: number
  speedScore: number
  consistencyScore: number
  recommendedDifficulty: 'easy' | 'medium' | 'hard'
}

export interface Certification {
  id: string
  moduleId: string
  moduleName: string
  issuedDate: string
  expiryDate: string
  certificateUrl: string
  verificationCode: string
  status: 'active' | 'expired' | 'revoked'
}

export interface Bookmark {
  id: string
  timestamp: number
  note: string
  createdAt: string
}

export interface RegulatoryReference {
  authority: RegulatoryAuthority
  document: string
  section: string
  effectiveDate: string
  url: string
}

export interface SourceLink {
  label: string
  url: string
}

export interface DraftContent {
  id: string
  moduleId: string
  changeType: 'update' | 'new' | 'removal'
  content: string
  rationale: string
  regulatoryTrigger: RegulatoryReference
  status: ContentStatus
  generatedAt: string
  reviewedBy?: string
  reviewedAt?: string
  comments?: string[]
  sources?: SourceLink[]
  // Agentic follow-up workflow flags
  agenticAuthorized?: boolean
  agenticApplied?: boolean
}

export interface AnalyticsData {
  overview: {
    totalLearners: number
    activeModules: number
    completionRate: number
    averageScore: number
    certificationsIssued: number
  }
  learnerMetrics: LearnerMetric[]
  moduleEffectiveness: ModuleMetric[]
  cohortComparison: CohortData[]
  complianceMetrics: ComplianceMetric[]
}

export interface LearnerMetric {
  userId: string
  userName: string
  modulesCompleted: number
  averageScore: number
  timeSpent: number
  engagementScore: number
  predictedSuccess: number
  atRisk: boolean
}

export interface ModuleMetric {
  moduleId: string
  moduleName: string
  enrollments: number
  completions: number
  averageScore: number
  averageTime: number
  dropoffPoints: string[]
  effectiveness: number
}

export interface CohortData {
  cohortId: string
  cohortName: string
  learnerCount: number
  averageProgress: number
  averageScore: number
  comparisonToBaseline: number
}

export interface ComplianceMetric {
  domain: IndustryDomain
  certifiedUsers: number
  expiringCertifications: number
  complianceRate: number
  auditReadiness: number
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  actorRole?: string
  origin?: 'ui' | 'ai'
  action: string
  resource: string
  resourceId: string
  details: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  prevHash?: string
  hash?: string
}

export interface LearningRecommendation {
  moduleId: string
  title: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: number
}