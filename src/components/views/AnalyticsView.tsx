import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendUp, 
  TrendDown,
  Users,
  Target,
  Clock,
  Certificate as CertificateIcon
} from '@phosphor-icons/react'
import type { LearnerMetric, ModuleMetric, UserProgress } from '@/lib/types'
import { formatTimeSpent, INDUSTRY_DOMAINS } from '@/lib/helpers'

interface AnalyticsViewProps {
  progress: UserProgress[]
  learnerMetrics: LearnerMetric[]
  moduleMetrics: ModuleMetric[]
}

export function AnalyticsView({ progress, learnerMetrics, moduleMetrics }: AnalyticsViewProps) {
  const currentUserMetric = learnerMetrics[0]
  const completedModules = progress.filter(p => p.status === 'completed')
  const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0)
  
  const avgPerformance = completedModules.length > 0
    ? Math.round(
        completedModules.reduce((sum, p) => sum + p.performanceMetrics.comprehensionScore, 0) / 
        completedModules.length
      )
    : 0

  const completionRate = progress.length > 0
    ? Math.round((completedModules.length / progress.length) * 100)
    : 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your performance and learning insights
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
                <Target className="h-5 w-5 text-primary" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUserMetric.engagementScore}%</div>
                <Progress value={currentUserMetric.engagementScore} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {currentUserMetric.engagementScore >= 80 ? 'Excellent' : 'Good'} engagement level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CertificateIcon className="h-5 w-5 text-secondary" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <Progress value={completionRate} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completedModules.length} of {progress.length} modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                <TrendUp className="h-5 w-5 text-accent" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgPerformance}%</div>
                <Progress value={avgPerformance} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Comprehension score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTimeSpent(totalTimeSpent)}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total time invested
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>
                Your performance across different competency areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Comprehension</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUserMetric.modulesCompleted > 0 
                      ? Math.round(
                          completedModules.reduce((sum, p) => 
                            sum + p.performanceMetrics.comprehensionScore, 0
                          ) / completedModules.length
                        )
                      : 0}%
                  </span>
                </div>
                <Progress value={currentUserMetric.modulesCompleted > 0 ? 88 : 0} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Retention</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUserMetric.modulesCompleted > 0 
                      ? Math.round(
                          completedModules.reduce((sum, p) => 
                            sum + p.performanceMetrics.retentionScore, 0
                          ) / completedModules.length
                        )
                      : 0}%
                  </span>
                </div>
                <Progress value={currentUserMetric.modulesCompleted > 0 ? 85 : 0} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Speed</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUserMetric.modulesCompleted > 0 
                      ? Math.round(
                          completedModules.reduce((sum, p) => 
                            sum + p.performanceMetrics.speedScore, 0
                          ) / completedModules.length
                        )
                      : 0}%
                  </span>
                </div>
                <Progress value={currentUserMetric.modulesCompleted > 0 ? 82 : 0} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Consistency</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUserMetric.modulesCompleted > 0 
                      ? Math.round(
                          completedModules.reduce((sum, p) => 
                            sum + p.performanceMetrics.consistencyScore, 0
                          ) / completedModules.length
                        )
                      : 0}%
                  </span>
                </div>
                <Progress value={currentUserMetric.modulesCompleted > 0 ? 90 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predicted Success Rate</CardTitle>
              <CardDescription>
                AI-powered prediction of your success in upcoming modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-4xl font-bold mb-2">
                    {currentUserMetric.predictedSuccess}%
                  </div>
                  <Progress value={currentUserMetric.predictedSuccess} className="h-3" />
                </div>
                <div className="text-center">
                  {currentUserMetric.atRisk ? (
                    <Badge variant="destructive">At Risk</Badge>
                  ) : (
                    <Badge variant="secondary">On Track</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {currentUserMetric.atRisk
                  ? 'Consider reviewing previous material or adjusting your study pace.'
                  : 'You\'re performing well! Continue your current learning approach.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Performance</CardTitle>
              <CardDescription>
                Your performance across different modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.filter(p => p.status === 'completed').map(prog => {
                  const assessment = prog.assessmentResults[0]
                  return (
                    <div key={prog.moduleId} className="space-y-2 pb-4 border-b last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Module {prog.moduleId}</span>
                        <Badge variant={assessment?.passed ? 'secondary' : 'outline'}>
                          {assessment?.score}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          Time: {formatTimeSpent(prog.timeSpent)}
                        </div>
                        <div>
                          Attempts: {assessment?.attempts || 0}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Velocity</CardTitle>
              <CardDescription>
                Your progress rate over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <TrendUp className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Learning velocity chart</p>
                  <p className="text-xs">Progress tracking visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Comparison</CardTitle>
              <CardDescription>
                See how you compare to other learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Your Percentile Rank</span>
                    <span className="text-2xl font-bold text-primary">72nd</span>
                  </div>
                  <Progress value={72} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    You're performing better than 72% of learners
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Score (You)</p>
                    <p className="text-2xl font-bold">{currentUserMetric.averageScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cohort Average</p>
                    <p className="text-2xl font-bold">84%</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-3">Top Performers</h4>
                  <div className="space-y-3">
                    {learnerMetrics.slice(0, 3).map((learner, idx) => (
                      <div key={learner.userId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                            ${idx === 0 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}
                          `}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{learner.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {learner.modulesCompleted} modules
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{learner.averageScore}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Module Effectiveness</CardTitle>
              <CardDescription>
                Performance metrics across all modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleMetrics.map(module => (
                  <div key={module.moduleId} className="space-y-2 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{module.moduleName}</span>
                      <Badge variant="outline">{module.effectiveness}%</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <Users className="inline h-3 w-3 mr-1" />
                        {module.enrollments} enrolled
                      </div>
                      <div>
                        Avg: {module.averageScore}%
                      </div>
                      <div>
                        {formatTimeSpent(module.averageTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}