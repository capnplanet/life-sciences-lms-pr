import type { IndustryDomain, RegulatoryAuthority } from './types'

export const INDUSTRY_DOMAINS: Record<IndustryDomain, string> = {
  'pharmacovigilance': 'Pharmacovigilance',
  'clinical-operations': 'Clinical Operations',
  'quality-assurance': 'Quality Assurance',
  'regulatory-affairs': 'Regulatory Affairs',
  'quality-control': 'Quality Control',
  'gmp': 'Good Manufacturing Practice (GMP)',
  'gcp': 'Good Clinical Practice (GCP)',
  'gpvp': 'Good Pharmacovigilance Practice (GPVP)',
  'gmlp': 'Good Machine Learning Practice (GMLP)'
}

export const REGULATORY_AUTHORITIES: Record<RegulatoryAuthority, string> = {
  'FDA': 'U.S. FDA',
  'EMA': 'European Medicines Agency',
  'Health Canada': 'Health Canada',
  'PMDA': 'Japan PMDA',
  'MHRA': 'UK MHRA',
  'CDSCO': 'India CDSCO',
  'ICH': 'ICH Guidelines'
}

export const MODULE_ICONS: Record<IndustryDomain, string> = {
  'pharmacovigilance': 'ShieldCheck',
  'clinical-operations': 'UsersThree',
  'quality-assurance': 'CheckCircle',
  'regulatory-affairs': 'FileText',
  'quality-control': 'TestTube',
  'gmp': 'Factory',
  'gcp': 'Heartbeat',
  'gpvp': 'ShieldPlus',
  'gmlp': 'Robot'
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatTimeSpent(minutes: number): string {
  if (minutes < 1) return '< 1 min'
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

export function getDaysUntil(date: string): number {
  const target = new Date(date)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isExpiringSoon(expiryDate: string, daysThreshold = 30): boolean {
  const days = getDaysUntil(expiryDate)
  return days > 0 && days <= daysThreshold
}

export function isExpired(expiryDate: string): boolean {
  return getDaysUntil(expiryDate) < 0
}

export function generateCertificateCode(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `LSA-${timestamp}-${random}`.toUpperCase()
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'not-started': 'text-muted-foreground',
    'in-progress': 'text-primary',
    'completed': 'text-secondary',
    'expired': 'text-destructive',
    'passed': 'text-secondary',
    'failed': 'text-destructive',
    'pending': 'text-accent',
    'locked': 'text-muted-foreground',
    'active': 'text-secondary',
    'draft': 'text-muted-foreground',
    'pending-review': 'text-accent',
    'approved': 'text-secondary',
    'published': 'text-primary'
  }
  return colors[status] || 'text-foreground'
}

export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'not-started': 'outline',
    'in-progress': 'default',
    'completed': 'secondary',
    'expired': 'destructive',
    'passed': 'secondary',
    'failed': 'destructive',
    'pending': 'outline',
    'active': 'secondary',
    'draft': 'outline'
  }
  return variants[status] || 'default'
}

export function calculateAdaptiveDifficulty(
  correctAnswers: number,
  totalAnswers: number,
  averageTime: number,
  targetTime: number
): 'easy' | 'medium' | 'hard' {
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0
  const speedRatio = targetTime > 0 ? averageTime / targetTime : 1
  
  if (accuracy >= 0.9 && speedRatio <= 0.8) {
    return 'hard'
  } else if (accuracy >= 0.7 && speedRatio <= 1.2) {
    return 'medium'
  } else {
    return 'easy'
  }
}

export function generateLearningPath(
  completedModules: string[],
  allModules: { id: string; prerequisites: string[] }[]
): string[] {
  const availableModules = allModules.filter(module => {
    if (completedModules.includes(module.id)) return false
    return module.prerequisites.every(prereq => completedModules.includes(prereq))
  })
  
  return availableModules.map(m => m.id)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}