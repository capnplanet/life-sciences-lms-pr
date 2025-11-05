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
  const [narrating, setNarrating] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [sectionCompleted, setSectionCompleted] = useState(false)

  const section = module.content[currentSection]
  const isLastSection = currentSection === module.content.length - 1
  const progressPercentage = Math.max(0, Math.min(100, Math.round(((currentSection + 1) / module.content.length) * 100)))

  useEffect(() => {
    // Auto-complete sections without interaction or video after a short dwell
    const needsInteraction = section?.type === 'interactive' && !!section?.interaction
    const needsScenario = section?.type === 'scenario' && !!section?.interaction
    const isVideo = section?.type === 'video'
    if (!section) return
    if (isVideo || needsInteraction || needsScenario) return
    const timer = setTimeout(() => {
      if (!sectionCompleted) {
        setSectionCompleted(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [currentSection, section, sectionCompleted])

  // Slide advance for slidecast-style "video" when no videoUrl provided
  useEffect(() => {
    if (section?.type !== 'video' || section.videoUrl || !videoPlaying) return
    const totalSlides = section.bookmarks?.length || 0
    if (totalSlides === 0) return
    const interval = setInterval(() => {
      setSlideIndex((i) => {
        const next = i + 1
        if (next >= totalSlides) {
          clearInterval(interval)
          setVideoPlaying(false)
          setSectionCompleted(true)
          return i
        }
        return next
      })
    }, 7000) // ~7s per slide to keep it short
    return () => clearInterval(interval)
  }, [section, videoPlaying])

  // Stop narration on section change/unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

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

  const handleNarrate = () => {
    if (!('speechSynthesis' in window) || !section?.transcript) {
      toast.error('Narration unavailable')
      return
    }
    if (narrating) {
      window.speechSynthesis.cancel()
      setNarrating(false)
      return
    }
    const utter = new SpeechSynthesisUtterance(section.transcript)
    utter.onend = () => setNarrating(false)
    setNarrating(true)
    window.speechSynthesis.speak(utter)
  }

  const renderContent = (section: ContentSection) => {
    switch (section.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
              {section.videoUrl ? (
                <video
                  src={section.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  onEnded={() => setSectionCompleted(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  <div className="relative z-10 w-full max-w-3xl text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        size="sm"
                        className="rounded-full"
                        onClick={() => setVideoPlaying(!videoPlaying)}
                      >
                        {videoPlaying ? (
                          <>
                            <Pause className="h-4 w-4" weight="fill" />
                            <span className="ml-2">Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" weight="fill" />
                            <span className="ml-2">Play</span>
                          </>
                        )}
                      </Button>
                      {section.transcript && (
                        <Button variant="outline" size="sm" onClick={handleNarrate}>
                          {narrating ? 'Stop narration' : 'Narrate transcript'}
                        </Button>
                      )}
                    </div>
                    <div className="mt-6 bg-card/80 border rounded-lg p-6 text-left">
                      <p className="text-xs text-muted-foreground">Slide {Math.min((section.bookmarks?.length || 0), slideIndex + 1)} of {section.bookmarks?.length || 0}</p>
                      <h4 className="font-semibold mt-1">{section.title}</h4>
                      <p className="mt-3 text-sm leading-relaxed font-serif">
                        {section.bookmarks?.[slideIndex]?.note || section.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
              {section.interaction ? (
                <InteractiveQuiz
                  question={section.interaction.question}
                  options={section.interaction.options}
                  correctIndex={section.interaction.correctIndex}
                  rationale={section.interaction.rationale}
                  onPass={() => setSectionCompleted(true)}
                />
              ) : (
                <div className="bg-accent/10 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-accent/20 p-4 mb-4">
                    <ListChecks className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Interactive scenario simulation will appear here
                  </p>
                </div>
              )}
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
              {section.interaction ? (
                <InteractiveQuiz
                  question={section.interaction.question}
                  options={section.interaction.options}
                  correctIndex={section.interaction.correctIndex}
                  rationale={section.interaction.rationale}
                  onPass={() => setSectionCompleted(true)}
                />
              ) : (
                <div className="bg-secondary/10 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Your Task</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze the scenario and determine the appropriate regulatory approach based on the guidelines you've learned.
                  </p>
                </div>
              )}
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
        {module.regulatoryReferences?.length ? (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Citations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {module.regulatoryReferences.map((ref, i) => (
                  <li key={i}>
                    <a href={ref.url} target="_blank" rel="noreferrer" className="underline">
                      {ref.authority}: {ref.document} ({ref.section})
                    </a>
                    <span className="text-muted-foreground ml-2">Effective: {ref.effectiveDate}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

function InteractiveQuiz({
  question,
  options,
  correctIndex,
  rationale,
  onPass
}: {
  question: string
  options: string[]
  correctIndex: number
  rationale: string
  onPass: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const correct = submitted && selected === correctIndex

  return (
    <div className="bg-background border rounded-lg p-4">
      <p className="font-medium mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <label key={idx} className={`flex items-center gap-3 p-2 rounded border cursor-pointer ${selected === idx ? 'border-primary' : 'border-muted'}`}>
            <input
              type="radio"
              name="interactive"
              checked={selected === idx}
              onChange={() => setSelected(idx)}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <Button size="sm" onClick={() => {
          setSubmitted(true)
          if (selected === correctIndex) {
            toast.success('Correct!')
            onPass()
          } else {
            toast.error('Not quite—review the rationale and try again')
          }
        }} disabled={selected === null}>
          Submit
        </Button>
        {submitted && (
          <span className={`text-sm ${correct ? 'text-secondary' : 'text-accent'}`}>
            {correct ? 'Correct' : 'Incorrect'} — {rationale}
          </span>
        )}
      </div>
    </div>
  )
}