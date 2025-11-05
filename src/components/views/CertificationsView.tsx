import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Certificate as CertificateIcon,
  Download,
  CheckCircle,
  Warning,
  Calendar
} from '@phosphor-icons/react'
import type { Certification } from '@/lib/types'
import { downloadCertificateSVG } from '@/lib/certificates'
import { formatDate, getDaysUntil, isExpiringSoon, isExpired } from '@/lib/helpers'
import { toast } from 'sonner'

interface CertificationsViewProps {
  certifications: Certification[]
  onNavigate: (view: string, moduleId?: string) => void
  userName?: string
}

export function CertificationsView({ certifications, onNavigate, userName = 'Learner' }: CertificationsViewProps) {
  const activeCerts = certifications.filter(c => c.status === 'active')
  const expiredCerts = certifications.filter(c => c.status === 'expired')
  const expiringSoon = activeCerts.filter(c => isExpiringSoon(c.expiryDate, 60))

  const handleDownload = (cert: Certification) => {
    try {
      downloadCertificateSVG(cert, userName)
      toast.success('Certificate download started')
    } catch (e) {
      toast.error('Unable to generate certificate')
    }
  }

  const handleVerify = (cert: Certification) => {
    toast.success(`Verification Code: ${cert.verificationCode}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your compliance certifications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-5 w-5 text-secondary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Valid certifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Warning className="h-5 w-5 text-accent" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoon.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require renewal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <CertificateIcon className="h-5 w-5 text-primary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certifications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {expiringSoon.length > 0 && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Warning className="h-5 w-5 text-accent" weight="fill" />
              <CardTitle className="text-base">Action Required</CardTitle>
            </div>
            <CardDescription>
              These certifications are expiring soon and need renewal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringSoon.map(cert => (
              <div key={cert.id} className="flex items-center justify-between gap-4 p-3 bg-card rounded-lg border">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{cert.moduleName}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expires in {getDaysUntil(cert.expiryDate)} days • {formatDate(cert.expiryDate)}
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

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Active Certifications</h2>
        
        {activeCerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <CertificateIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No active certifications</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Complete training modules to earn compliance certifications
              </p>
              <Button onClick={() => onNavigate('learning')}>
                Browse Modules
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCerts.map(cert => (
              <Card key={cert.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full" />
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">Active</Badge>
                      <CardTitle className="text-base leading-tight">
                        {cert.moduleName}
                      </CardTitle>
                    </div>
                    <CertificateIcon className="h-8 w-8 text-secondary flex-shrink-0" weight="fill" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Issued</span>
                      <span className="font-medium">{formatDate(cert.issuedDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium">{formatDate(cert.expiryDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Valid for</span>
                      <span className={`font-medium ${isExpiringSoon(cert.expiryDate, 60) ? 'text-accent' : 'text-secondary'}`}>
                        {getDaysUntil(cert.expiryDate)} days
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDownload(cert)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => handleVerify(cert)}
                    >
                      Verification: {cert.verificationCode}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {expiredCerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Expired Certifications</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expiredCerts.map(cert => (
              <Card key={cert.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge variant="destructive" className="mb-2">Expired</Badge>
                      <CardTitle className="text-base leading-tight">
                        {cert.moduleName}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expired on</span>
                      <span className="font-medium">{formatDate(cert.expiryDate)}</span>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onNavigate('learning', cert.moduleId)}
                  >
                    Recertify
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">About Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-medium">GAMP 5 Compliant</p>
              <p className="text-muted-foreground text-xs">
                All certifications meet GAMP 5 requirements for training documentation
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-medium">21 CFR Part 11</p>
              <p className="text-muted-foreground text-xs">
                Electronic signatures and records comply with FDA regulations
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Calendar className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-medium">Renewal Reminders</p>
              <p className="text-muted-foreground text-xs">
                Automatic notifications at 90, 60, and 30 days before expiration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}