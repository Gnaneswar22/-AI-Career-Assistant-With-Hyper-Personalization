"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BrainCircuit,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Github,
  Linkedin,
  CalendarIcon,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface WorkExperience {
  id: string
  company: string
  title: string
  startDate: Date | undefined
  endDate: Date | undefined
  isCurrent: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: Date | undefined
  endDate: Date | undefined
  gpa: string
}

export default function ProfileOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    targetRole: "",
    experienceLevel: "",
  })

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    {
      id: "1",
      company: "",
      title: "",
      startDate: undefined,
      endDate: undefined,
      isCurrent: false,
      description: "",
    },
  ])

  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      institution: "",
      degree: "",
      field: "",
      startDate: undefined,
      endDate: undefined,
      gpa: "",
    },
  ])

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillProficiency, setSkillProficiency] = useState<Record<string, number>>({})

  const SKILL_CATEGORIES = {
    Technical: ["JavaScript", "Python", "React", "Node.js", "SQL", "AWS", "Docker", "Git", "TypeScript", "Java"],
    "Soft Skills": ["Communication", "Leadership", "Problem Solving", "Teamwork", "Time Management", "Adaptability"],
    Industry: ["Project Management", "Data Analysis", "Digital Marketing", "UX Design", "DevOps", "Machine Learning"],
    Tools: ["Figma", "Jira", "Slack", "Tableau", "Excel", "Photoshop", "VS Code", "Postman"],
  }

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        id: Date.now().toString(),
        company: "",
        title: "",
        startDate: undefined,
        endDate: undefined,
        isCurrent: false,
        description: "",
      },
    ])
  }

  const removeWorkExperience = (id: string) => {
    setWorkExperience(workExperience.filter((exp) => exp.id !== id))
  }

  const updateWorkExperience = (id: string, field: string, value: any) => {
    setWorkExperience(workExperience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        field: "",
        startDate: undefined,
        endDate: undefined,
        gpa: "",
      },
    ])
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id))
  }

  const updateEducation = (id: string, field: string, value: any) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
    if (!selectedSkills.includes(skill)) {
      setSkillProficiency((prev) => ({ ...prev, [skill]: 3 }))
    }
  }

  const updateSkillProficiency = (skill: string, level: number) => {
    setSkillProficiency((prev) => ({ ...prev, [skill]: level }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>Let's start with your basic information and career goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Profiles</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      value={profileData.linkedinUrl}
                      onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub Profile
                    </Label>
                    <Input
                      id="github"
                      value={profileData.githubUrl}
                      onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                      placeholder="https://github.com/johndoe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio Website</Label>
                    <Input
                      id="portfolio"
                      value={profileData.portfolioUrl}
                      onChange={(e) => setProfileData({ ...profileData, portfolioUrl: e.target.value })}
                      placeholder="https://johndoe.dev"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Career Goals</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Role *</Label>
                    <Input
                      id="targetRole"
                      value={profileData.targetRole}
                      onChange={(e) => setProfileData({ ...profileData, targetRole: e.target.value })}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level *</Label>
                    <Select
                      value={profileData.experienceLevel}
                      onValueChange={(value) => setProfileData({ ...profileData, experienceLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                        <SelectItem value="executive">Executive (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-primary" />
                <CardTitle>Work Experience</CardTitle>
              </div>
              <CardDescription>Add your work history to showcase your professional journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {workExperience.map((exp, index) => (
                <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Experience {index + 1}</h4>
                    {workExperience.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkExperience(exp.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                        placeholder="Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title *</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateWorkExperience(exp.id, "title", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {exp.startDate ? format(exp.startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={exp.startDate}
                            onSelect={(date) => updateWorkExperience(exp.id, "startDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                            disabled={exp.isCurrent}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {exp.isCurrent ? "Current" : exp.endDate ? format(exp.endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={exp.endDate}
                            onSelect={(date) => updateWorkExperience(exp.id, "endDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.isCurrent}
                          onChange={(e) => updateWorkExperience(exp.id, "isCurrent", e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-sm">
                          I currently work here
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(exp.id, "description", e.target.value)}
                      placeholder="Describe your role, responsibilities, and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addWorkExperience} variant="outline" className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Experience
              </Button>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <CardTitle>Education</CardTitle>
              </div>
              <CardDescription>Add your educational background and qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="Stanford University"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GPA</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {edu.startDate ? format(edu.startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={edu.startDate}
                            onSelect={(date) => updateEducation(edu.id, "startDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {edu.endDate ? format(edu.endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={edu.endDate}
                            onSelect={(date) => updateEducation(edu.id, "endDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Education
              </Button>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="h-6 w-6 text-primary" />
                <CardTitle>Skills Assessment</CardTitle>
              </div>
              <CardDescription>Select your skills and rate your proficiency level (1-5 scale)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">{category}</h3>
                  <div className="grid gap-4">
                    {skills.map((skill) => (
                      <div key={skill} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="rounded"
                          />
                          <Label htmlFor={skill} className="font-medium">
                            {skill}
                          </Label>
                        </div>
                        {selectedSkills.includes(skill) && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Proficiency:</span>
                            <Select
                              value={skillProficiency[skill]?.toString() || "3"}
                              onValueChange={(value) => updateSkillProficiency(skill, Number.parseInt(value))}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Beginner</SelectItem>
                                <SelectItem value="2">2 - Basic</SelectItem>
                                <SelectItem value="3">3 - Intermediate</SelectItem>
                                <SelectItem value="4">4 - Advanced</SelectItem>
                                <SelectItem value="5">5 - Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Selected Skills Summary</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                      {skill} (Level {skillProficiency[skill] || 3})
                    </Badge>
                  ))}
                </div>
                {selectedSkills.length === 0 && <p className="text-muted-foreground text-sm">No skills selected yet</p>}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-heading)" }}>
              Complete Profile Setup
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Step {currentStep} of {totalSteps} - Let's build your comprehensive career profile
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              className="bg-primary hover:bg-primary/90"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link href="/onboarding/complete">
              <Button className="bg-primary hover:bg-primary/90">
                Complete Setup
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
