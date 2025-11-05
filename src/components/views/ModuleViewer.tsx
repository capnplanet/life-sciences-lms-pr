import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  Play,
  Pause,
  BookmarkSimple,
  CheckCircle,
  ArrowRight,
  ListChecks
} from '@phosphor-icons/react'
import type { LearningModule, UserProgress, ContentSection } from '@/lib/types'
import { formatDuration, INDUSTRY_DOMAINS } from '@/lib/helpers'
import { toast } from 'sonner'

interface ModuleViewerProps {
  module: LearningModule
  progress: UserProgress
  onNavigate: (view: string) => void
  onUpdateProgress: (progress: Partial<UserProgress>) => void
  onStartAssessment: (moduleId: string, assessmentId: string) => void
}

export function ModuleViewer({ 
  module, 
  progress, 
  onNavigate,
  onUpdateProgress,
  onStartAssessment
}: ModuleViewerProps) {
  const [currentSection, setCurrentSection] = useState(progress.currentSection || 0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [sectionCompleted, setSectionCompleted] = useState(false)

  const section = module.content[currentSection]
  const isLastSection = currentSection === module.content.length - 1
  const progressPercentage = Math.max(0, Math.min(100, Math.round(((currentSection + 1) / module.content.length) * 100)))

  useEffect(() => {
    const timer = setTimeout(() => {
      if (section && !sectionCompleted) {
        setSectionCompleted(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentSection, section, sectionCompleted])

  const handleNext = () => {
    if (isLastSection) {
      onUpdateProgress({
        currentSection: currentSection,
        progress: 100,
        status: 'in-progress'
      })
      if (module.assessments.length > 0) {
        toast.success('Module content completed! Ready for assessment.')
      }
    } else {
      const nextSection = currentSection + 1
      setCurrentSection(nextSection)
      setSectionCompleted(false)
      onUpdateProgress({
        currentSection: nextSection,
        progress: Math.round(((nextSection + 1) / module.content.length) * 100),
        status: 'in-progress'
      })
      toast.success('Section completed!')
    }
  }

  const handleBookmark = () => {
    toast.success('Bookmark added')
  }

  const renderContent = (section: ContentSection) => {
    switch (section.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <div className="relative z-10 text-center">
                <Button
                  size="lg"
                  className="h-16 w-16 rounded-full"
                  onClick={() => setVideoPlaying(!videoPlaying)}
                >
                  {videoPlaying ? (
                    <Pause className="h-8 w-8" weight="fill" />
                  ) : (
                    <Play className="h-8 w-8" weight="fill" />
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Video Player: {section.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Duration: {formatDuration(section.duration || 0)}
                </p>
              </div>
            </div>
            
            {section.transcript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                    {section.transcript}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 'text':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none">
                <p className="font-serif text-base leading-relaxed text-foreground">
                  {section.content}
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 'interactive':
        return (
          <Card className="border-2 border-accent/50">
            <CardHeader>
              <CardTitle className="text-lg">Interactive Exercise</CardTitle>
              <CardDescription>{section.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-serif text-sm leading-relaxed">
                {section.content}
              </p>
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-accent/20 p-4 mb-4">
                  <ListChecks className="h-8 w-8 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Interactive scenario simulation will appear here
                </p>
                <Button className="mt-4" size="sm">
                  Start Interactive Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'scenario':
        return (
          <Card className="border-2 border-secondary/50">
            <CardHeader>
              <CardTitle className="text-lg">Case Study</CardTitle>
              <CardDescription>{section.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-serif text-sm leading-relaxed">
                {section.content}
              </p>
              <div className="bg-secondary/10 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Your Task</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze the scenario and determine the appropriate regulatory approach based on the guidelines you've learned.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('learning')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning
            </Button>
            <Badge variant="secondary">
              {INDUSTRY_DOMAINS[module.domain]}
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold">{module.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatDuration(module.duration)}</span>
              <span>•</span>
              <span className="capitalize">{module.difficulty}</span>
              <span>•</span>
              <span>{module.content.length} sections</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Section {currentSection + 1} of {module.content.length}
                </span>
                <span className="font-medium">{progressPercentage}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{section?.title}</h2>
              {section?.duration && (
                <p className="text-sm text-muted-foreground">
                  Estimated time: {formatDuration(section.duration)}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
            >
              <BookmarkSimple className="mr-2 h-4 w-4" />
              Bookmark
            </Button>
          </div>

          {section && renderContent(section)}

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => {
                if (currentSection > 0) {
                  setCurrentSection(currentSection - 1)
                  setSectionCompleted(true)
                }
              }}
              disabled={currentSection === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {isLastSection && module.assessments.length > 0 ? (
              <Button
                onClick={() => onStartAssessment(module.id, module.assessments[0].id)}
              >
                Start Assessment
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!sectionCompleted}
              >
                Next Section
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Module Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {module.content.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setCurrentSection(idx)
                    setSectionCompleted(true)
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    idx === currentSection
                      ? 'bg-primary/10 text-primary'
                      : idx < currentSection
                      ? 'hover:bg-muted'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={idx > currentSection}
                >
                  <div className="flex items-center gap-3">
                    {idx < currentSection ? (
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" weight="fill" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-current flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{sec.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{sec.type}</p>
                    </div>
                  </div>
                  {sec.duration && (
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(sec.duration)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}