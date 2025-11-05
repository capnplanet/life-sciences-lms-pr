import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus,
  PencilSimple,
  Eye,
  Trash,
  MagnifyingGlass,
  Users,
  ChartBar
} from '@phosphor-icons/react'
import type { LearningModule, AuditLogEntry } from '@/lib/types'
import { exportAuditJSON, exportAuditCSV } from '@/lib/audit'
import { formatDate, formatDateTime, INDUSTRY_DOMAINS } from '@/lib/helpers'
import { toast } from 'sonner'

interface ContentManagementProps {
  modules: LearningModule[]
  auditLog: AuditLogEntry[]
}

export function ContentManagementView({ modules, auditLog }: ContentManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateModule = () => {
    toast.success('Module creation interface would open here')
  }

  const handleEditModule = (moduleId: string) => {
    toast.success(`Editing module ${moduleId}`)
  }

  const handlePreviewModule = (moduleId: string) => {
    toast.success(`Preview module ${moduleId}`)
  }

  const handleDeleteModule = (moduleId: string) => {
    toast.error('Delete confirmation would appear here')
  }

  const handleExportJSON = () => {
    const data = exportAuditJSON(auditLog)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit log exported (JSON)')
  }

  const handleExportCSV = () => {
    const data = exportAuditCSV(auditLog)
    const blob = new Blob([data], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit log exported (CSV)')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage learning modules
          </p>
        </div>
        <Button onClick={handleCreateModule}>
          <Plus className="mr-2 h-4 w-4" />
          Create Module
        </Button>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredModules.map(module => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <Badge variant={
                          module.status === 'published' ? 'secondary' :
                          module.status === 'draft' ? 'outline' :
                          'default'
                        }>
                          {module.status}
                        </Badge>
                      </div>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreviewModule(module.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditModule(module.id)}
                      >
                        <PencilSimple className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteModule(module.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{INDUSTRY_DOMAINS[module.domain]}</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Version: {module.version}
                    </div>
                    <div className="text-muted-foreground">
                      {module.content.length} sections
                    </div>
                    <div className="text-muted-foreground">
                      Updated: {formatDate(module.updatedAt)}
                    </div>
                    <div className="text-muted-foreground capitalize">
                      {module.difficulty}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                <ChartBar className="h-5 w-5 text-primary" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modules.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {modules.filter(m => m.status === 'published').length} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                <Users className="h-5 w-5 text-secondary" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">488</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
                <ChartBar className="h-5 w-5 text-accent" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">86%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  System-wide rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Module Performance</CardTitle>
              <CardDescription>
                Engagement and completion metrics by module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.slice(0, 5).map(module => (
                  <div key={module.id} className="space-y-2 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{module.title}</span>
                      <Badge variant="outline">85% completion</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                      <div>156 enrolled</div>
                      <div>142 completed</div>
                      <div>Avg: 87%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>
                    Complete audit log of all system activities (21 CFR Part 11 compliant)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
                  <Button onClick={handleExportJSON}>Export JSON</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.map(entry => (
                  <div 
                    key={entry.id} 
                    className="flex items-start justify-between gap-4 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{entry.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {entry.resource}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {entry.userName} • {formatDateTime(entry.timestamp)}
                      </p>
                      {Object.keys(entry.details).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Details: {JSON.stringify(entry.details)}
                        </p>
                      )}
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