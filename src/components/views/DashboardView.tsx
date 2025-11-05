import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  TrendUp, 
  Clock, 
  CheckCircle,
  Certificate as CertificateIcon,
  Warning
} from '@phosphor-icons/react'
import type { LearningModule, UserProgress, Certification } from '@/lib/types'
import { formatDuration, calculateProgress, getDaysUntil, isExpiringSoon } from '@/lib/helpers'
import { INDUSTRY_DOMAINS } from '@/lib/helpers'

interface DashboardViewProps {
  modules: LearningModule[]
  progress: UserProgress[]
  certifications: Certification[]
  onNavigate: (view: string, moduleId?: string) => void
}

export function DashboardView({ modules, progress, certifications, onNavigate }: DashboardViewProps) {
  const inProgressModules = progress.filter(p => p.status === 'in-progress')
  const completedModules = progress.filter(p => p.status === 'completed')
  const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0)
  const averageScore = completedModules.length > 0
    ? Math.round(
        completedModules.reduce((sum, p) => {
          const finalAssessment = p.assessmentResults.find(a => a.passed)
          return sum + (finalAssessment?.score || 0)
        }, 0) / completedModules.length
      )
    : 0

  const expiringSoonCerts = certifications.filter(c => 
    c.status === 'active' && isExpiringSoon(c.expiryDate, 60)
  )

  const availableModules = modules.filter(module => {
    const moduleProgress = progress.find(p => p.moduleId === module.id)
    if (!moduleProgress || moduleProgress.status === 'not-started') {
      return module.prerequisites.every(prereqId =>
        progress.some(p => p.moduleId === prereqId && p.status === 'completed')
      )
    }
    return false
  }).slice(0, 3)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your learning progress and certifications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-secondary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedModules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {inProgressModules.length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendUp className="h-5 w-5 text-primary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {completedModules.length} assessments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-5 w-5 text-accent" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalTimeSpent / 60)}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total learning time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <CertificateIcon className="h-5 w-5 text-secondary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certifications.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active credentials
            </p>
          </CardContent>
        </Card>
      </div>

      {expiringSoonCerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Warning className="h-5 w-5 text-destructive" weight="fill" />
              <CardTitle className="text-base">Expiring Certifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringSoonCerts.map(cert => (
              <div key={cert.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{cert.moduleName}</p>
                  <p className="text-xs text-muted-foreground">
                    Expires in {getDaysUntil(cert.expiryDate)} days
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onNavigate('learning', cert.moduleId)}
                >
                  Renew
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {inProgressModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inProgressModules.map(progressItem => {
              const module = modules.find(m => m.id === progressItem.moduleId)
              if (!module) return null

              return (
                <div key={module.id} className="space-y-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {INDUSTRY_DOMAINS[module.domain]}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {progressItem.progress}% Complete
                    </Badge>
                  </div>
                  <Progress value={progressItem.progress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(progressItem.timeSpent)} spent
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => onNavigate('module-viewer', module.id)}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {availableModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>
              Based on your progress and career goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableModules.map(module => (
              <div 
                key={module.id}
                className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary">
                      {INDUSTRY_DOMAINS[module.domain]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(module.duration)}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {module.difficulty}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate('module-viewer', module.id)}
                >
                  Start
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}