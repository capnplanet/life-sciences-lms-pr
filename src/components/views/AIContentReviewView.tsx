import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  Robot,
  CheckCircle,
  XCircle,
  Clock,
  Lightbulb,
  GitBranch
} from '@phosphor-icons/react'
import type { DraftContent } from '@/lib/types'
import { evaluateGuardrails } from '@/lib/ai/guardrails'
import { startRegwatchPolling } from '@/lib/ai/regwatch'
import { formatDate, REGULATORY_AUTHORITIES } from '@/lib/helpers'
import { toast } from 'sonner'

interface AIContentReviewProps {
  draftContent: DraftContent[]
  modulesLite: { id: string; domain: string }[]
  onApprove: (draftId: string, reviewComment?: string) => void
  onReject: (draftId: string, reviewComment: string) => void
  onRequestRevision: (draftId: string, reviewComment: string) => void
  onProposeDraft: (draft: DraftContent) => void
}

export function AIContentReviewView({ draftContent, modulesLite, onApprove, onReject, onRequestRevision, onProposeDraft }: AIContentReviewProps) {
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null)
  const [reviewComment, setReviewComment] = useState('')
  const [polling, setPolling] = useState(false)

  const pendingDrafts = draftContent.filter(d => d.status === 'pending-review')
  const approvedDrafts = draftContent.filter(d => d.status === 'approved')
  const draft = draftContent.find(d => d.id === selectedDraft)

  const handleApprove = (draftId: string) => {
    const draft = draftContent.find(d => d.id === draftId)
    if (draft) {
      const report = evaluateGuardrails(draft)
      if (report.blockApprove) {
        toast.error('Approval blocked by guardrails')
        return
      }
    }
    onApprove(draftId, reviewComment)
    toast.success('Content approved and queued for deployment')
    setSelectedDraft(null)
    setReviewComment('')
  }

  const handleReject = (draftId: string) => {
    if (!reviewComment.trim()) {
      toast.error('Please provide feedback for rejection')
      return
    }
    onReject(draftId, reviewComment)
    toast.error('Content rejected with feedback sent to AI system')
    setSelectedDraft(null)
    setReviewComment('')
  }

  const handleRequestRevision = (draftId: string) => {
    if (!reviewComment.trim()) {
      toast.error('Please provide revision requirements')
      return
    }
    onRequestRevision(draftId, reviewComment)
    toast.success('Revision requested. AI will generate updated draft.')
    setSelectedDraft(null)
    setReviewComment('')
  }

  // Real-time proposals (simulated polling). Toggle with button.
  const togglePolling = () => {
    if (polling) {
      setPolling(false)
      stop?.()
      toast.success('Stopped real-time proposals')
    } else {
      setPolling(true)
      stop = startRegwatchPolling(modulesLite, (draft) => onProposeDraft(draft), 20000)
      toast.success('Real-time proposals enabled')
    }
  }

  let stop: null | (() => void) = null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Content Review</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve AI-generated curriculum updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Robot className="h-5 w-5 text-accent" weight="fill" />
          <span className="text-sm text-muted-foreground">
            {pendingDrafts.length} pending review
          </span>
          <Button size="sm" variant={polling ? 'secondary' : 'outline'} onClick={togglePolling} className="ml-2">
            {polling ? 'Pause Proposals' : 'Start Proposals'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-5 w-5 text-accent" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDrafts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting human approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-5 w-5 text-secondary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedDrafts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for deployment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Lightbulb className="h-5 w-5 text-primary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingDrafts.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedDrafts.length})
          </TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingDrafts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <CheckCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground max-w-md">
                  No pending content reviews at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                {pendingDrafts.map(draft => (
                  <Card 
                    key={draft.id}
                    className={`cursor-pointer transition-colors ${
                      selectedDraft === draft.id ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedDraft(draft.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="capitalize">
                              {draft.changeType}
                            </Badge>
                            <Badge variant="default">
                              {REGULATORY_AUTHORITIES[draft.regulatoryTrigger.authority]}
                            </Badge>
                          </div>
                          <CardTitle className="text-base">
                            Module {draft.moduleId} Update
                          </CardTitle>
                        </div>
                        <Robot className="h-5 w-5 text-accent flex-shrink-0" weight="fill" />
                      </div>
                      <CardDescription>
                        Generated: {formatDate(draft.generatedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {draft.rationale}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {draft && (
                <Card className="lg:sticky lg:top-6 h-fit">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {draft.changeType}
                      </Badge>
                      <Badge variant="default">
                        {REGULATORY_AUTHORITIES[draft.regulatoryTrigger.authority]}
                      </Badge>
                    </div>
                    <CardTitle>Review Details</CardTitle>
                    <CardDescription>
                      AI-generated content based on regulatory update
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Guardrails report */}
                    {(() => { 
                      const report = evaluateGuardrails(draft)
                      return (
                        <div className={`rounded-lg p-3 ${report.ok ? 'bg-secondary/10 border border-secondary/30' : 'bg-accent/10 border border-accent/30'}`}>
                          <div className="text-sm font-medium mb-2">Guardrails</div>
                          <ul className="text-xs space-y-1">
                            {report.issues.map((i, idx) => (
                              <li key={idx} className={i.severity === 'error' ? 'text-accent' : 'text-muted-foreground'}>
                                • {i.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })()}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Regulatory Trigger</h4>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Document:</span>
                          <span className="font-medium">{draft.regulatoryTrigger.document}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Section:</span>
                          <span className="font-medium">{draft.regulatoryTrigger.section}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Effective:</span>
                          <span className="font-medium">
                            {formatDate(draft.regulatoryTrigger.effectiveDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Rationale</h4>
                      <p className="text-sm font-serif leading-relaxed bg-muted/30 rounded-lg p-3">
                        {draft.rationale}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Proposed Content</h4>
                      <div className="bg-card border-2 border-primary/20 rounded-lg p-4">
                        <p className="text-sm font-serif leading-relaxed">
                          {draft.content}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Review Comments</h4>
                      <Textarea
                        placeholder="Add your feedback or revision requirements..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRequestRevision(draft.id)}
                      >
                        <GitBranch className="mr-2 h-4 w-4" />
                        Request Revision
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(draft.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(draft.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedDrafts.map(draft => (
            <Card key={draft.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">Approved</Badge>
                      <Badge variant="outline" className="capitalize">
                        {draft.changeType}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">Module {draft.moduleId} Update</CardTitle>
                    <CardDescription className="mt-2">
                      Approved by {draft.reviewedBy} on {formatDate(draft.reviewedAt!)}
                    </CardDescription>
                  </div>
                  <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0" weight="fill" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-serif leading-relaxed">
                  {draft.content}
                </p>
                {draft.comments && draft.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-2">Review Comments</h4>
                    <div className="space-y-2">
                      {draft.comments.map((comment, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground italic">
                          "{comment}"
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Generation Insights</CardTitle>
              <CardDescription>
                Performance metrics and continuous improvement analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Regulatory Sources Monitored</h4>
                  <div className="space-y-2">
                    {Object.entries(REGULATORY_AUTHORITIES).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span>{value}</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Content Quality Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Approval Rate</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: '94%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Accuracy Score</span>
                        <span className="font-medium">97%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '97%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Avg Review Time</span>
                        <span className="font-medium">18 min</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-sm mb-3">Recent Updates Detected</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>FDA Data Integrity Guidance Update</span>
                    <Badge variant="outline">2 days ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>EMA GVP Module VI Amendment</span>
                    <Badge variant="outline">1 week ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>ICH E6(R3) Draft Consultation</span>
                    <Badge variant="outline">2 weeks ago</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}