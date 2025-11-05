import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Trophy
} from '@phosphor-icons/react'
import type { Assessment, Question, AssessmentResult } from '@/lib/types'
import { toast } from 'sonner'

interface AssessmentViewProps {
  moduleId: string
  moduleName: string
  assessment: Assessment
  onComplete: (result: AssessmentResult) => void
  onNavigate: (view: string) => void
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    difficulty: 'medium',
    question: 'According to ICH-GCP E6(R2), what is the primary purpose of Good Clinical Practice guidelines?',
    options: [
      'To reduce the cost of clinical trials',
      'To protect the rights, safety, and well-being of trial subjects',
      'To accelerate drug approval timelines',
      'To standardize clinical trial documentation'
    ],
    correctAnswer: 'To protect the rights, safety, and well-being of trial subjects',
    explanation: 'ICH-GCP E6(R2) explicitly states that its primary purpose is to protect the rights, safety, and well-being of trial subjects while ensuring the credibility of clinical trial data.',
    regulatoryContext: 'ICH E6(R2) Section 1.1'
  },
  {
    id: 'q2',
    type: 'mcq',
    difficulty: 'medium',
    question: 'What is the maximum timeframe for reporting serious unexpected suspected adverse reactions (SUSARs) to regulatory authorities?',
    options: [
      '7 calendar days',
      '15 calendar days',
      '30 calendar days',
      '24 hours'
    ],
    correctAnswer: '15 calendar days',
    explanation: 'For fatal or life-threatening SUSARs, the initial report must be made within 7 days, with a follow-up report within 8 additional days (15 days total). For non-fatal SUSARs, the timeline is 15 calendar days.',
    regulatoryContext: 'EMA GVP Module VI'
  },
  {
    id: 'q3',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Under 21 CFR Part 11, which of the following is NOT a required component of electronic signature validation?',
    options: [
      'Unique identification of the signer',
      'Timestamp of signature application',
      'Biometric authentication for all users',
      'Link between signature and signed record'
    ],
    correctAnswer: 'Biometric authentication for all users',
    explanation: '21 CFR Part 11 does not mandate biometric authentication. It requires unique identification, timestamps, and proper linkage, but allows for various authentication methods meeting security requirements.',
    regulatoryContext: '21 CFR Part 11.50'
  },
  {
    id: 'q4',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What does CAPA stand for in pharmaceutical quality systems?',
    options: [
      'Corrective Action and Preventive Action',
      'Clinical Assessment and Performance Analysis',
      'Compliance Audit and Process Approval',
      'Continuous Analysis and Process Adjustment'
    ],
    correctAnswer: 'Corrective Action and Preventive Action',
    explanation: 'CAPA stands for Corrective Action and Preventive Action, a systematic approach to investigating and resolving quality issues in pharmaceutical manufacturing.',
    regulatoryContext: '21 CFR Part 820.100'
  },
  {
    id: 'q5',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which ICH guideline addresses the Common Technical Document (CTD) format for regulatory submissions?',
    options: [
      'ICH E6',
      'ICH M4',
      'ICH Q7',
      'ICH E2A'
    ],
    correctAnswer: 'ICH M4',
    explanation: 'ICH M4 describes the Common Technical Document format, which is the internationally agreed format for regulatory submissions across multiple regions.',
    regulatoryContext: 'ICH M4 Guideline'
  }
]

export function AssessmentView({ 
  moduleId,
  moduleName,
  assessment, 
  onComplete,
  onNavigate
}: AssessmentViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const questions = SAMPLE_QUESTIONS.slice(0, assessment.adaptive ? 5 : 3)
  const question = questions[currentQuestion]
  const rawProgress = ((currentQuestion) / questions.length) * 100
  const progress = Math.max(0, Math.min(100, rawProgress))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }))
  }

  const handleSubmitAnswer = () => {
    const userAnswer = answers[question.id]
    const correct = userAnswer === question.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    if (!correct) {
      toast.error('Incorrect answer. Review the explanation.')
    } else {
      toast.success('Correct!')
    }
  }

  const handleNext = () => {
    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowFeedback(false)
      setQuestionStartTime(Date.now())
    } else {
      const correctAnswers = questions.filter(
        q => answers[q.id] === q.correctAnswer
      ).length
      const score = Math.round((correctAnswers / questions.length) * 100)
      setFinalScore(score)
      setAssessmentComplete(true)

      const result: AssessmentResult = {
        assessmentId: assessment.id,
        score,
        passed: score >= assessment.passingScore,
        attempts: 1,
        answers: questions.map(q => ({
          questionId: q.id,
          answer: answers[q.id] || '',
          correct: answers[q.id] === q.correctAnswer,
          timeSpent: 30
        })),
        completedAt: new Date().toISOString(),
        timeSpent
      }

      onComplete(result)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (assessmentComplete) {
    const passed = finalScore >= assessment.passingScore

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {passed ? (
                <div className="inline-flex items-center justify-center rounded-full bg-secondary/20 p-6">
                  <Trophy className="h-16 w-16 text-secondary" weight="fill" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center rounded-full bg-destructive/20 p-6">
                  <XCircle className="h-16 w-16 text-destructive" weight="fill" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
            </CardTitle>
            <CardDescription>
              {passed 
                ? 'Congratulations! You have successfully completed the assessment.'
                : `You need ${assessment.passingScore}% to pass. Review the material and try again.`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-3xl font-bold">{finalScore}%</p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">
                  {questions.filter(q => answers[q.id] === q.correctAnswer).length}/{questions.length}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{formatTime(timeSpent)}</p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onNavigate('learning')}
              >
                Back to Learning
              </Button>
              {passed ? (
                <Button
                  className="flex-1"
                  onClick={() => onNavigate('certifications')}
                >
                  View Certificate
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  Retry Assessment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{assessment.title}</h1>
                <p className="text-sm text-muted-foreground">{moduleName}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeSpent)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-lg leading-relaxed">
                {question.question}
              </CardTitle>
              <Badge variant="outline" className="capitalize flex-shrink-0">
                {question.difficulty}
              </Badge>
            </div>
            {question.regulatoryContext && (
              <CardDescription className="mt-2">
                Regulatory Context: {question.regulatoryContext}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[question.id] as string}
              onValueChange={handleAnswer}
              disabled={showFeedback}
            >
              <div className="space-y-3">
                {question.options?.map((option, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
                      showFeedback
                        ? option === question.correctAnswer
                          ? 'border-secondary bg-secondary/10'
                          : option === answers[question.id]
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="flex-1 cursor-pointer leading-relaxed"
                    >
                      {option}
                      {showFeedback && option === question.correctAnswer && (
                        <CheckCircle className="inline-block ml-2 h-5 w-5 text-secondary" weight="fill" />
                      )}
                      {showFeedback && option === answers[question.id] && option !== question.correctAnswer && (
                        <XCircle className="inline-block ml-2 h-5 w-5 text-destructive" weight="fill" />
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {showFeedback && (
              <Card className={isCorrect ? 'border-secondary' : 'border-destructive'}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-secondary" weight="fill" />
                        Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-destructive" weight="fill" />
                        Incorrect
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-serif leading-relaxed">
                    {question.explanation}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-3 pt-4">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!answers[question.id]}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}