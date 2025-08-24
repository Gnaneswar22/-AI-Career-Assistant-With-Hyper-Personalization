"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Wand2,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Target,
  Sparkles,
  Copy,
  RefreshCw,
  Save,
  Share2,
} from "lucide-react"

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedinUrl: string
    portfolioUrl: string
  }
  targetRole: string
  professionalSummary: string
  experience: Array<{
    id: string
    company: string
    title: string
    duration: string
    description: string
    achievements: string[]
  }>
  skills: {
    technical: string[]
    soft: string[]
    tools: string[]
  }
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    year: string
    gpa?: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
  }>
}

const RESUME_TEMPLATES = [
  { id: "modern", name: "Modern Professional", atsScore: 95, description: "Clean, ATS-friendly design" },
  { id: "classic", name: "Classic Executive", atsScore: 98, description: "Traditional format, highest ATS score" },
  { id: "creative", name: "Creative Tech", atsScore: 88, description: "Modern design for tech roles" },
  { id: "minimal", name: "Minimal Clean", atsScore: 92, description: "Simple, focused layout" },
]

const ATS_CHECKS = [
  { name: "Contact Information", status: "pass", score: 100 },
  { name: "Section Headers", status: "pass", score: 95 },
  { name: "Font & Formatting", status: "pass", score: 98 },
  { name: "Keyword Optimization", status: "warning", score: 85 },
  { name: "File Structure", status: "pass", score: 100 },
  { name: "Length & Content", status: "pass", score: 92 },
]

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState("builder")
  const [selectedTemplate, setSelectedTemplate] = useState("classic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [atsScore, setAtsScore] = useState(92)
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedinUrl: "linkedin.com/in/johndoe",
      portfolioUrl: "johndoe.dev",
    },
    targetRole: "Senior Software Engineer",
    professionalSummary:
      "Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact products that serve millions of users.",
    experience: [
      {
        id: "1",
        company: "Tech Corp",
        title: "Software Engineer",
        duration: "2021 - Present",
        description: "Lead development of customer-facing web applications",
        achievements: [
          "Increased application performance by 40% through code optimization",
          "Led team of 4 developers on major product redesign",
          "Implemented CI/CD pipeline reducing deployment time by 60%",
        ],
      },
    ],
    skills: {
      technical: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
      soft: ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
      tools: ["Git", "Jira", "Figma", "VS Code", "Postman"],
    },
    education: [
      {
        id: "1",
        institution: "Stanford University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        year: "2019",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution with React frontend and Node.js backend",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        url: "github.com/johndoe/ecommerce",
      },
    ],
  })

  const handleAIGenerate = async (section: string) => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    // Update ATS score after generation
    setAtsScore(Math.min(98, atsScore + Math.floor(Math.random() * 5)))
  }

  const handleExportPDF = () => {
    // Simulate PDF export
    console.log("Exporting resume as PDF...")
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 80) return "text-yellow-600"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-primary/10"
    if (score >= 80) return "bg-yellow-100"
    return "bg-destructive/10"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  AI Resume Builder
                </h1>
                <p className="text-sm text-muted-foreground">ATS-Optimized • AI-Powered • Professional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>{atsScore}%</div>
                <div className="text-xs text-muted-foreground">ATS Score</div>
              </div>
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={handleExportPDF} className="bg-primary hover:bg-primary/90">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="ats-check">ATS Check</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Personal Information</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAIGenerate("personal")}
                        disabled={isGenerating}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        AI Optimize
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={resumeData.personalInfo.email}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={resumeData.personalInfo.phone}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={resumeData.personalInfo.location}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Professional Summary</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAIGenerate("summary")}
                        disabled={isGenerating}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isGenerating ? "Generating..." : "AI Generate"}
                      </Button>
                    </CardTitle>
                    <CardDescription>Target Role: {resumeData.targetRole}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Target Role</Label>
                      <Input
                        value={resumeData.targetRole}
                        onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Summary</Label>
                      <Textarea
                        value={resumeData.professionalSummary}
                        onChange={(e) => setResumeData({ ...resumeData, professionalSummary: e.target.value })}
                        rows={4}
                        placeholder="Write a compelling summary of your experience and achievements..."
                      />
                      <div className="text-xs text-muted-foreground">
                        {resumeData.professionalSummary.length}/500 characters
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Work Experience</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAIGenerate("experience")}
                        disabled={isGenerating}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        AI Enhance
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input value={exp.company} placeholder="Company Name" />
                          </div>
                          <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input value={exp.title} placeholder="Job Title" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input value={exp.duration} placeholder="e.g., Jan 2021 - Present" />
                        </div>
                        <div className="space-y-2">
                          <Label>Key Achievements</Label>
                          {exp.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center gap-2">
                              <span className="text-muted-foreground">•</span>
                              <Input value={achievement} placeholder="Quantified achievement with impact..." />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Skills</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAIGenerate("skills")}
                        disabled={isGenerating}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        AI Optimize
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold">Technical Skills</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {resumeData.skills.technical.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Soft Skills</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {resumeData.skills.soft.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-accent/10 text-accent">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* ATS Score Card */}
                <Card className={`border-2 ${atsScore >= 90 ? "border-primary/20" : "border-yellow-200"}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      ATS Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(atsScore)} mb-2`}>{atsScore}%</div>
                      <div className="text-sm text-muted-foreground">
                        {atsScore >= 90 ? "Excellent" : atsScore >= 80 ? "Good" : "Needs Improvement"}
                      </div>
                    </div>
                    <Progress value={atsScore} className="h-3" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Keyword Match</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Format Score</span>
                        <span className="font-semibold">98%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Content Quality</span>
                        <span className="font-semibold">92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent" />
                      AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Add more keywords</p>
                          <p className="text-xs text-muted-foreground">
                            Include "React", "TypeScript" for better matching
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Great achievements</p>
                          <p className="text-xs text-muted-foreground">Your quantified results look excellent</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate Resume
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Template
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share for Review
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
              <p className="text-muted-foreground">All templates are ATS-optimized and professionally designed</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RESUME_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className={`${getScoreBg(template.atsScore)} ${getScoreColor(template.atsScore)}`}>
                        {template.atsScore}% ATS
                      </Badge>
                      {selectedTemplate === template.id && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ATS Check Tab */}
          <TabsContent value="ats-check" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">ATS Compatibility Check</h2>
              <p className="text-muted-foreground">Detailed analysis of your resume's ATS compatibility</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`text-6xl font-bold ${getScoreColor(atsScore)} mb-2`}>{atsScore}%</div>
                      <div className="text-lg text-muted-foreground">
                        {atsScore >= 90 ? "Excellent" : atsScore >= 80 ? "Good" : "Needs Improvement"}
                      </div>
                    </div>
                    <Progress value={atsScore} className="h-4 mb-4" />
                    <p className="text-sm text-muted-foreground text-center">
                      Your resume has a high probability of passing ATS screening
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <h4 className="font-semibold text-accent mb-2">Keyword Optimization</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add more role-specific keywords to improve matching
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          + React
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          + TypeScript
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          + Agile
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">Format Excellence</h4>
                      <p className="text-sm text-muted-foreground">
                        Your resume format is perfectly optimized for ATS parsing
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ATS_CHECKS.map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          {check.status === "pass" ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          )}
                          <span className="font-medium">{check.name}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getScoreColor(check.score)}`}>{check.score}%</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Resume Preview</h2>
                <p className="text-muted-foreground">How your resume will appear to employers</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Full Screen
                </Button>
                <Button onClick={handleExportPDF} className="bg-primary hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            <Card className="p-8 bg-white text-black min-h-[800px]">
              {/* Resume Preview Content */}
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center border-b pb-4">
                  <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.fullName}</h1>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      {resumeData.personalInfo.email} • {resumeData.personalInfo.phone}
                    </div>
                    <div>{resumeData.personalInfo.location}</div>
                    <div>
                      {resumeData.personalInfo.linkedinUrl} • {resumeData.personalInfo.portfolioUrl}
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800">PROFESSIONAL SUMMARY</h2>
                  <p className="text-sm leading-relaxed text-gray-700">{resumeData.professionalSummary}</p>
                </div>

                {/* Experience */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800">PROFESSIONAL EXPERIENCE</h2>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-600">{exp.duration}</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800">TECHNICAL SKILLS</h2>
                  <div className="text-sm text-gray-700">
                    <p>
                      <strong>Programming Languages:</strong> {resumeData.skills.technical.join(", ")}
                    </p>
                    <p className="mt-1">
                      <strong>Tools & Technologies:</strong> {resumeData.skills.tools.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800">EDUCATION</h2>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-sm text-gray-600">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
