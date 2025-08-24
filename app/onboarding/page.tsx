"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { BrainCircuit, Clock, Zap, ArrowRight, CheckCircle, Target, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

const POPULAR_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "TypeScript",
  "Java",
  "C++",
  "Machine Learning",
  "Data Analysis",
  "Project Management",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
]

const POPULAR_ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
  "Marketing Manager",
  "Business Analyst",
  "Full Stack Developer",
  "Data Analyst",
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
]

export default function OnboardingPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [targetRole, setTargetRole] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : prev.length < 3 ? [...prev, skill] : prev,
    )
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim()) && selectedSkills.length < 3) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()])
      setCustomSkill("")
    }
  }

  const handleQuickStart = async () => {
    if (selectedSkills.length === 0 || !targetRole) return

    setIsGenerating(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setShowResults(true)
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-heading)" }}>
                Your Career Profile is Ready!
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">Here's what we've generated for you in under 3 minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* ATS Resume */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle>ATS-Optimized Resume</CardTitle>
                </div>
                <CardDescription>Ready for {targetRole} positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>ATS Score</span>
                    <span className="font-semibold text-primary">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <Button size="sm" className="w-full">
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Matches */}
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-accent" />
                  <CardTitle>Job Matches</CardTitle>
                </div>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-accent">3</div>
                  <p className="text-sm text-muted-foreground">High-match positions found</p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    View Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 3-Month Roadmap */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <CardTitle>Learning Roadmap</CardTitle>
                </div>
                <CardDescription>3-month career plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold">Month 1:</div>
                    <p className="text-muted-foreground">React Advanced Patterns</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    View Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Want to unlock more features?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding/profile">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Complete Full Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <BrainCircuit className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <CardTitle>AI is Working Its Magic</CardTitle>
            <CardDescription>Generating your personalized career profile...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing skills</span>
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex justify-between text-sm">
                <span>Generating resume</span>
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Finding job matches</span>
                <div className="h-4 w-4" />
              </div>
            </div>
            <Progress value={65} className="h-2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-black" style={{ fontFamily: "var(--font-heading)" }}>
              Let's Build Your Career Profile
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your path: Quick start in 3 minutes or complete setup for maximum personalization
          </p>
        </div>

        {/* Path Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-primary/20 bg-primary/5 relative">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>Quick Start</CardTitle>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Recommended
                </Badge>
              </div>
              <CardDescription>Get started in 3 minutes with instant results</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Select 3 key skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Choose target role</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Get instant ATS resume</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>3 job matches + roadmap</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-accent" />
                <CardTitle>Complete Setup</CardTitle>
              </div>
              <CardDescription>15-30 minutes for maximum personalization</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Import LinkedIn/GitHub</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Detailed skills assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Multi-version resumes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>6-12 month roadmaps</span>
                </li>
              </ul>
              <Link href="/onboarding/profile">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Start Complete Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Form */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Start Form
            </CardTitle>
            <CardDescription>Select your top 3 skills and target role to get started instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skills Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Select Your Top Skills ({selectedSkills.length}/3)</Label>
                <Badge variant="outline">{3 - selectedSkills.length} remaining</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedSkills.includes(skill) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    {selectedSkills.includes(skill) && <CheckCircle className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                  disabled={selectedSkills.length >= 3}
                />
                <Button
                  onClick={addCustomSkill}
                  disabled={!customSkill.trim() || selectedSkills.length >= 3}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
            </div>

            <Separator />

            {/* Target Role */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Target Role</Label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROLES.map((role) => (
                  <Badge
                    key={role}
                    variant={targetRole === role ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      targetRole === role ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => setTargetRole(role)}
                  >
                    {role}
                    {targetRole === role && <CheckCircle className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Or enter custom role..."
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <Button
              onClick={handleQuickStart}
              disabled={selectedSkills.length === 0 || !targetRole}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Generate My Career Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
