import { Button } from "@/components/ui/button"
import { BrainCircuit, BarChart3, FileText, Search, Settings, User } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-muted/30 border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">AI Career Assistant</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/roadmap"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <User className="h-4 w-4" />
              Career Insights
            </Link>
            <Link
              href="/resume"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Resume Builder
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Search className="h-4 w-4" />
              Job Search
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div></div>
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                Signup
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-black mb-4 text-foreground">
              Your Hyper-Personalized
              <br />
              Career GPS
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">Get guided roadmaps to accelerate your career growth.</p>

            <Link href="/onboarding">
              <Button className="bg-black hover:bg-black/90 text-white px-8 py-3 mb-12">Get Started</Button>
            </Link>

            <div className="bg-muted/50 rounded-lg p-16 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-lg mb-4">
                  Discover the best pathways for your career with our advanced algorithms.
                </p>
                <div className="flex justify-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full"></div>
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
