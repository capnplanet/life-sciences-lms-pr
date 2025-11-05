import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  MagnifyingGlass,
  Play,
  CheckCircle,
  Clock,
  Lock,
  Certificate as CertificateIcon
} from '@phosphor-icons/react'
import type { LearningModule, UserProgress, ModuleStatus } from '@/lib/types'
import { formatDuration, INDUSTRY_DOMAINS } from '@/lib/helpers'

interface LearningViewProps {
  modules: LearningModule[]
  progress: UserProgress[]
  onNavigate: (view: string, moduleId?: string) => void
}

export function LearningView({ modules, progress, onNavigate }: LearningViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ModuleStatus>('all')

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId)
  }

  const getModuleStatus = (module: LearningModule): ModuleStatus => {
    const moduleProgress = getModuleProgress(module.id)
    if (!moduleProgress) {
      const prereqsMet = module.prerequisites.every(prereqId =>
        progress.some(p => p.moduleId === prereqId && p.status === 'completed')
      )
      return prereqsMet ? 'not-started' : 'not-started'
    }
    return moduleProgress.status
  }

  const isLocked = (module: LearningModule): boolean => {
    return module.prerequisites.some(prereqId =>
      !progress.some(p => p.moduleId === prereqId && p.status === 'completed')
    )
  }

  const filteredModules = modules.filter(module => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      INDUSTRY_DOMAINS[module.domain].toLowerCase().includes(searchQuery.toLowerCase())

    const moduleStatus = getModuleStatus(module)
    const matchesFilter = statusFilter === 'all' || moduleStatus === statusFilter

    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: ModuleStatus, locked: boolean) => {
    if (locked) return <Lock className="h-5 w-5" weight="fill" />
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-secondary" weight="fill" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-primary" weight="fill" />
      default:
        return <Play className="h-5 w-5 text-muted-foreground" weight="fill" />
    }
  }

  const getActionButton = (module: LearningModule) => {
    const locked = isLocked(module)
    const status = getModuleStatus(module)
    const moduleProgress = getModuleProgress(module.id)

    if (locked) {
      return (
        <Button disabled variant="outline" size="sm">
          <Lock className="mr-2 h-4 w-4" />
          Locked
        </Button>
      )
    }

    if (status === 'completed') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate('module-viewer', module.id)}
        >
          Review
        </Button>
      )
    }

    if (status === 'in-progress') {
      return (
        <Button 
          size="sm"
          onClick={() => onNavigate('module-viewer', module.id)}
        >
          Continue ({moduleProgress?.progress}%)
        </Button>
      )
    }

    return (
      <Button 
        variant="outline"
        size="sm"
        onClick={() => onNavigate('module-viewer', module.id)}
      >
        Start Module
      </Button>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
        <p className="text-muted-foreground mt-1">
          Browse and complete regulatory compliance training modules
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="not-started">Available</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules.map(module => {
          const locked = isLocked(module)
          const status = getModuleStatus(module)
          const moduleProgress = getModuleProgress(module.id)

          return (
            <Card 
              key={module.id}
              className={locked ? 'opacity-60' : 'hover:shadow-md transition-shadow'}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {module.title}
                    </CardTitle>
                  </div>
                  {getStatusIcon(status, locked)}
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {INDUSTRY_DOMAINS[module.domain]}
                  </Badge>
                  {module.certification && (
                    <Badge variant="outline" className="text-xs">
                      <CertificateIcon className="mr-1 h-3 w-3" />
                      Certification
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDuration(module.duration)}</span>
                  <span className="capitalize">{module.difficulty}</span>
                  <span>{module.content.length} sections</span>
                </div>

                {moduleProgress && status === 'in-progress' && (
                  <div className="space-y-1">
                    <Progress value={Math.max(0, Math.min(100, moduleProgress.progress))} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.max(0, Math.min(100, moduleProgress.progress))}% complete
                    </p>
                  </div>
                )}

                {module.prerequisites.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Prerequisites: </span>
                    {module.prerequisites.length} required
                  </div>
                )}

                {getActionButton(module)}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <MagnifyingGlass className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No modules found</h3>
          <p className="text-muted-foreground max-w-md">
            Try adjusting your search or filter to find the training you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}