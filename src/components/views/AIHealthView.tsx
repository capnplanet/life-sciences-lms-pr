import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDateTime } from '@/lib/helpers'

interface ProviderHealth {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  latencyMs: number
  errorRate: number // 0-1
}

interface GuardrailStats {
  checked: number
  passed: number
  failed: number
}

export function AIHealthView() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())
  const [providers, setProviders] = useState<ProviderHealth[]>([
    { name: 'OpenAI', status: 'healthy', latencyMs: 420, errorRate: 0.01 },
    { name: 'Anthropic', status: 'healthy', latencyMs: 390, errorRate: 0.008 },
    { name: 'Llama (proxy)', status: 'degraded', latencyMs: 780, errorRate: 0.035 }
  ])
  const [guardrails, setGuardrails] = useState<GuardrailStats>({ checked: 128, passed: 121, failed: 7 })

  useEffect(() => {
    const id = setInterval(() => {
      // Simulate small jitter in metrics
      setProviders(prev => prev.map(p => ({
        ...p,
        latencyMs: Math.max(150, Math.round(p.latencyMs * (0.95 + Math.random() * 0.1))),
        errorRate: Math.max(0, Math.min(0.2, parseFloat((p.errorRate * (0.9 + Math.random() * 0.2)).toFixed(3))))
      })))
      setGuardrails(prev => ({
        checked: prev.checked + Math.floor(Math.random() * 3),
        passed: prev.passed + Math.floor(Math.random() * 3),
        failed: prev.failed + (Math.random() < 0.2 ? 1 : 0)
      }))
      setLastUpdated(new Date().toISOString())
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const overallUptime = 100 - (providers.reduce((acc, p) => acc + p.errorRate, 0) / providers.length) * 100
  const guardrailPassPct = guardrails.checked > 0 ? Math.round((guardrails.passed / guardrails.checked) * 100) : 100

  const statusBadge = (status: ProviderHealth['status']) => (
    <Badge variant={status === 'healthy' ? 'secondary' : status === 'degraded' ? 'default' : 'destructive'}>{status}</Badge>
  )

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Model Health</h1>
        <span className="text-sm text-muted-foreground">Last updated: {formatDateTime(lastUpdated)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold mb-2">{overallUptime.toFixed(1)}%</div>
            <Progress value={overallUptime} />
            <p className="mt-2 text-xs text-muted-foreground">Average success across providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guardrail Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold mb-2">{guardrailPassPct}%</div>
            <Progress value={guardrailPassPct} />
            <p className="mt-2 text-xs text-muted-foreground">{guardrails.passed}/{guardrails.checked} checks passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold mb-2">{providers.filter(p => p.status !== 'healthy').length}</div>
            <p className="text-xs text-muted-foreground">Non-healthy providers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map(p => (
              <div key={p.name} className="flex items-center justify-between border rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{p.name}</div>
                  {statusBadge(p.status)}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Latency:</span> {p.latencyMs} ms
                  </div>
                  <div>
                    <span className="text-muted-foreground">Error rate:</span> {(p.errorRate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transparency</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
            <li>Primary sources are validated via a whitelist and effective date checks.</li>
            <li>Proposals flagged as drafts or misaligned subjects are blocked from approval.</li>
            <li>All approvals record reviewer, timestamp, and comments for auditability.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
