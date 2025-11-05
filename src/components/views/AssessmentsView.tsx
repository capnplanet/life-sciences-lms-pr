import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LearningModule, UserProgress } from '@/lib/types'
import { INDUSTRY_DOMAINS } from '@/lib/helpers'

interface AssessmentsViewProps {
  modules: LearningModule[]
  progress: UserProgress[]
  onStartAssessment: (moduleId: string, assessmentId: string) => void
}

export function AssessmentsView({ modules, progress, onStartAssessment }: AssessmentsViewProps) {
  const modulesWithAssessments = modules.filter(m => m.assessments && m.assessments.length > 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground mt-1">All available assessments by module</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modulesWithAssessments.map(module => {
          const moduleProgress = progress.find(p => p.moduleId === module.id)
          const isCompleted = moduleProgress?.status === 'completed'
          return (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {INDUSTRY_DOMAINS[module.domain]}
                    </CardDescription>
                  </div>
                  {isCompleted && <Badge variant="secondary">Completed</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {module.assessments.map(assess => (
                  <div key={assess.id} className="flex items-center justify-between gap-3 p-3 rounded-md border">
                    <div>
                      <div className="font-medium text-sm">{assess.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        Passing score: {assess.passingScore}% {assess.timeLimit ? `• ${assess.timeLimit} min` : ''} • {assess.type}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => onStartAssessment(module.id, assess.id)}>
                      {isCompleted ? 'Retake' : 'Start'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
