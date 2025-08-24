"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  FileText,
  Target,
  TrendingUp,
  Award,
  Users,
  ArrowRight,
  Download,
  Share2,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function OnboardingCompletePage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            🎉 Profile Complete!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive career profile is ready. Here's everything we've generated for you based on your detailed
            information.
          </p>
        </div>

        {/* Generated Assets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Multi-Version Resumes */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>ATS-Optimized Resumes</CardTitle>
              </div>
              <CardDescription>Multiple versions tailored for different roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Software Engineer</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    96% ATS
                  </Badge>
                </div>
                <Progress value={96} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Full Stack Developer</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    94% ATS
                  </Badge>
                </div>
                <Progress value={94} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tech Lead</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    91% ATS
                  </Badge>
                </div>
                <Progress value={91} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Recommendations */}
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-accent" />
                <CardTitle>Curated Job Matches</CardTitle>
              </div>
              <CardDescription>Personalized recommendations updated daily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">47</div>
                <p className="text-sm text-muted-foreground">High-match positions found</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Match Score Average</span>
                  <span className="font-semibold">89%</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  Google
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Microsoft
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Meta
                </Badge>
                <Badge variant="outline" className="text-xs">
                  +44 more
                </Badge>
              </div>

              <Button size="sm" variant="outline" className="w-full bg-transparent">
                View All Jobs
              </Button>
            </CardContent>
          </Card>

          {/* Learning Roadmap */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle>12-Month Roadmap</CardTitle>
              </div>
              <CardDescription>Adaptive learning path with milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Q1: Advanced React Patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary rounded-full" />
                  <span className="text-sm">Q2: System Design Mastery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-muted-foreground rounded-full" />
                  <span className="text-sm text-muted-foreground">Q3: Leadership Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-muted-foreground rounded-full" />
                  <span className="text-sm text-muted-foreground">Q4: Tech Lead Transition</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-semibold">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>

              <Button size="sm" variant="outline" className="w-full bg-transparent">
                View Full Roadmap
              </Button>
            </CardContent>
          </Card>

          {/* Certificates & Badges */}
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-accent" />
                <CardTitle>Certificates Ready</CardTitle>
              </div>
              <CardDescription>Verified achievements and micro-credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">3</div>
                <p className="text-sm text-muted-foreground">Certificates generated</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Profile Completion</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    Earned
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Skills Assessment</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    Earned
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Career Readiness</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    Earned
                  </Badge>
                </div>
              </div>

              <Button size="sm" variant="outline" className="w-full bg-transparent">
                <Share2 className="mr-2 h-4 w-4" />
                Share on LinkedIn
              </Button>
            </CardContent>
          </Card>

          {/* Interview Prep */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Interview Coaching</CardTitle>
              </div>
              <CardDescription>Role-specific practice sessions ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions Generated</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Practice Sessions</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mock Interviews</span>
                  <span className="font-semibold">5</span>
                </div>
              </div>

              <Button size="sm" variant="outline" className="w-full bg-transparent">
                Start Practice
              </Button>
            </CardContent>
          </Card>

          {/* AI Career Coach */}
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-accent" />
                <CardTitle>AI Career Coach</CardTitle>
              </div>
              <CardDescription>24/7 personalized guidance available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Your AI coach is ready with personalized insights based on your profile
                </p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">
                  Career Strategy
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  Salary Negotiation
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  Skill Development
                </Badge>
              </div>

              <Button size="sm" className="w-full bg-accent hover:bg-accent/90">
                Chat with AI Coach
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">What's Next?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your career transformation journey begins now. Access your personalized dashboard to start applying to jobs,
            following your roadmap, and tracking your progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Download Career Kit
              <Download className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
