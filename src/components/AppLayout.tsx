import { useState, type ReactNode } from 'react'
import { 
  House, 
  BookOpen, 
  ChartBar, 
  Certificate, 
  ListChecks,
  Gear,
  Robot,
  List,
  BookBookmark
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface AppLayoutProps {
  children: ReactNode
  currentView: string
  onNavigate: (view: string) => void
  userRole: 'learner' | 'instructor' | 'admin'
  userName: string
  userAvatar?: string
}

export function AppLayout({ 
  children, 
  currentView, 
  onNavigate,
  userRole,
  userName,
  userAvatar
}: AppLayoutProps) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: House },
    { id: 'learning', label: 'My Learning', icon: BookOpen },
    { id: 'glossary', label: 'Glossary', icon: BookBookmark },
    { id: 'assessments', label: 'Assessments', icon: ListChecks },
    { id: 'analytics', label: 'Analytics', icon: ChartBar },
    { id: 'certifications', label: 'Certifications', icon: Certificate },
  ]

  const adminNavigation = [
    { id: 'content-management', label: 'Content Management', icon: Gear },
    { id: 'ai-content', label: 'AI Content Review', icon: Robot },
    { id: 'ai-health', label: 'AI Health', icon: ChartBar },
  ]

  const handleNavigation = (id: string) => {
    onNavigate(id)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" weight="bold" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">LifeSci Academy</span>
            <span className="text-xs text-muted-foreground leading-none mt-0.5">
              Regulatory Training
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
              )}
              onClick={() => handleNavigation(item.id)}
            >
              <Icon className="h-5 w-5" weight={isActive ? 'fill' : 'regular'} />
              {item.label}
            </Button>
          )
        })}

        {(userRole === 'admin' || userRole === 'instructor') && (
          <>
            <div className="my-4 border-t border-border" />
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
              ADMINISTRATION
            </div>
            {adminNavigation.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                  )}
                  onClick={() => handleNavigation(item.id)}
                >
                  <Icon className="h-5 w-5" weight={isActive ? 'fill' : 'regular'} />
                  {item.label}
                </Button>
              )
            })}
          </>
        )}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{userName}</span>
            <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <header className="flex h-16 items-center justify-between border-b border-border px-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" weight="bold" />
            </div>
            <span className="text-sm font-bold">LifeSci Academy</span>
          </div>

          <Avatar className="h-9 w-9">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card">
        <SidebarContent />
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}