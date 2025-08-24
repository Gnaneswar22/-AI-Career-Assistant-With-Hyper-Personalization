"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, BookOpen, Target, TrendingUp, Star } from "lucide-react"

interface Skill {
  name: string
  currentLevel: number
  targetLevel: number
  priority: "high" | "medium" | "low"
}

interface Milestone {
  id: string
  title: string
  description: string
  skills: string[]
  estimatedWeeks: number
  completed: boolean
  courses: Course[]
  projects: Project[]
}

interface Course {
  id: string
  title: string
  provider: string
  duration: string
  rating: number
  url: string
  skills: string[]
}

interface Project {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedHours: number
  skills: string[]
}

interface Roadmap {
  id: string
  title: string
  targetRole: string
  totalWeeks: number
  completionPercentage: number
  milestones: Milestone[]
  skillGaps: Skill[]
}

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState("generate")
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Form state for roadmap generation
  const [formData, setFormData] = useState({
    targetRole: "",
    currentSkills: "",
    experience: "",
    timeCommitment: "",
    learningStyle: "",
  })

  useEffect(() => {
    // Load existing roadmaps
    loadRoadmaps()
  }, [])

  const loadRoadmaps = async () => {
    // Mock data - in real app, fetch from API
    const mockRoadmaps: Roadmap[] = [
      {
        id: "1",
        title: "Full-Stack Developer Roadmap",
        targetRole: "Full-Stack Developer",
        totalWeeks: 24,
        completionPercentage: 35,
        milestones: [
          {
            id: "m1",
            title: "Frontend Fundamentals",
            description: "Master HTML, CSS, and JavaScript basics",
            skills: ["HTML", "CSS", "JavaScript"],
            estimatedWeeks: 4,
            completed: true,
            courses: [
              {
                id: "c1",
                title: "Modern JavaScript Fundamentals",
                provider: "Udemy",
                duration: "12 hours",
                rating: 4.8,
                url: "#",
                skills: ["JavaScript", "ES6+"],
              },
            ],
            projects: [
              {
                id: "p1",
                title: "Personal Portfolio Website",
                description: "Build a responsive portfolio using HTML, CSS, and JavaScript",
                difficulty: "beginner",
                estimatedHours: 20,
                skills: ["HTML", "CSS", "JavaScript"],
              },
            ],
          },
          {
            id: "m2",
            title: "React Development",
            description: "Learn React and modern frontend development",
            skills: ["React", "JSX", "State Management"],
            estimatedWeeks: 6,
            completed: false,
            courses: [
              {
                id: "c2",
                title: "Complete React Developer Course",
                provider: "Coursera",
                duration: "40 hours",
                rating: 4.9,
                url: "#",
                skills: ["React", "Redux", "Context API"],
              },
            ],
            projects: [
              {
                id: "p2",
                title: "Task Management App",
                description: "Build a full-featured task manager with React",
                difficulty: "intermediate",
                estimatedHours: 35,
                skills: ["React", "State Management", "API Integration"],
              },
            ],
          },
        ],
        skillGaps: [
          { name: "React", currentLevel: 2, targetLevel: 8, priority: "high" },
          { name: "Node.js", currentLevel: 1, targetLevel: 7, priority: "high" },
          { name: "Database Design", currentLevel: 0, targetLevel: 6, priority: "medium" },
        ],
      },
    ]
    setRoadmaps(mockRoadmaps)
    if (mockRoadmaps.length > 0) {
      setSelectedRoadmap(mockRoadmaps[0])
    }
  }

  const generateRoadmap = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newRoadmap = await response.json()
        setRoadmaps([newRoadmap, ...roadmaps])
        setSelectedRoadmap(newRoadmap)
        setActiveTab("view")
      }
    } catch (error) {
      console.error("Failed to generate roadmap:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const updateMilestoneProgress = async (milestoneId: string, completed: boolean) => {
    if (!selectedRoadmap) return

    const updatedRoadmap = {
      ...selectedRoadmap,
      milestones: selectedRoadmap.milestones.map((m) => (m.id === milestoneId ? { ...m, completed } : m)),
    }

    // Recalculate completion percentage
    const completedMilestones = updatedRoadmap.milestones.filter((m) => m.completed).length
    updatedRoadmap.completionPercentage = Math.round((completedMilestones / updatedRoadmap.milestones.length) * 100)

    setSelectedRoadmap(updatedRoadmap)
    setRoadmaps(roadmaps.map((r) => (r.id === updatedRoadmap.id ? updatedRoadmap : r)))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Roadmap Planner</h1>
        <p className="text-gray-600">Get AI-generated personalized learning paths to achieve your career goals</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Roadmap</TabsTrigger>
          <TabsTrigger value="view">View Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-600" />
                Create Your Learning Roadmap
              </CardTitle>
              <CardDescription>Tell us about your goals and we'll create a personalized learning path</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Select
                    value={formData.targetRole}
                    onValueChange={(value) => setFormData({ ...formData, targetRole: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-stack-developer">Full-Stack Developer</SelectItem>
                      <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                      <SelectItem value="backend-developer">Backend Developer</SelectItem>
                      <SelectItem value="data-scientist">Data Scientist</SelectItem>
                      <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                      <SelectItem value="mobile-developer">Mobile Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => setFormData({ ...formData, experience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-4 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeCommitment">Time Commitment</Label>
                  <Select
                    value={formData.timeCommitment}
                    onValueChange={(value) => setFormData({ ...formData, timeCommitment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How much time can you dedicate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-10">5-10 hours/week</SelectItem>
                      <SelectItem value="10-20">10-20 hours/week</SelectItem>
                      <SelectItem value="20-30">20-30 hours/week</SelectItem>
                      <SelectItem value="30+">30+ hours/week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learningStyle">Learning Style</Label>
                  <Select
                    value={formData.learningStyle}
                    onValueChange={(value) => setFormData({ ...formData, learningStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How do you prefer to learn?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Courses</SelectItem>
                      <SelectItem value="reading">Reading & Documentation</SelectItem>
                      <SelectItem value="hands-on">Hands-on Projects</SelectItem>
                      <SelectItem value="mixed">Mixed Approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSkills">Current Skills</Label>
                <Textarea
                  id="currentSkills"
                  placeholder="List your current technical skills (e.g., HTML, CSS, JavaScript, Python...)"
                  value={formData.currentSkills}
                  onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={generateRoadmap}
                disabled={isGenerating || !formData.targetRole}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your Roadmap...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Generate AI Roadmap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="space-y-6">
          {selectedRoadmap && (
            <>
              {/* Roadmap Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedRoadmap.title}</CardTitle>
                      <CardDescription>
                        Target: {selectedRoadmap.targetRole} • {selectedRoadmap.totalWeeks} weeks
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-600">{selectedRoadmap.completionPercentage}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>
                  <Progress value={selectedRoadmap.completionPercentage} className="mt-4" />
                </CardHeader>
              </Card>

              {/* Skill Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    Skill Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedRoadmap.skillGaps.map((skill, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge
                            variant={
                              skill.priority === "high"
                                ? "destructive"
                                : skill.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {skill.priority}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current: {skill.currentLevel}/10</span>
                            <span>Target: {skill.targetLevel}/10</span>
                          </div>
                          <Progress value={(skill.currentLevel / 10) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Milestones */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Learning Milestones</h2>
                {selectedRoadmap.milestones.map((milestone, index) => (
                  <Card key={milestone.id} className={milestone.completed ? "bg-green-50" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateMilestoneProgress(milestone.id, !milestone.completed)}
                            className={milestone.completed ? "text-green-600" : "text-gray-400"}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                          <div>
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                            <CardDescription>{milestone.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{milestone.estimatedWeeks} weeks</div>
                          <div className="text-xs text-gray-500">estimated</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Skills */}
                        <div>
                          <h4 className="font-medium mb-2">Skills to Learn:</h4>
                          <div className="flex flex-wrap gap-2">
                            {milestone.skills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Courses */}
                        {milestone.courses.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Recommended Courses:</h4>
                            <div className="space-y-2">
                              {milestone.courses.map((course) => (
                                <div
                                  key={course.id}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                    <div>
                                      <div className="font-medium">{course.title}</div>
                                      <div className="text-sm text-gray-500">
                                        {course.provider} • {course.duration}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                      <span className="text-sm">{course.rating}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      FREE
                                    </Badge>
                                    <Button size="sm" variant="outline">
                                      Start Course
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {milestone.projects.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Practice Projects:</h4>
                            <div className="space-y-2">
                              {milestone.projects.map((project) => (
                                <div
                                  key={project.id}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div>
                                    <div className="font-medium">{project.title}</div>
                                    <div className="text-sm text-gray-500 mb-2">{project.description}</div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>Difficulty: {project.difficulty}</span>
                                      <span>{project.estimatedHours} hours</span>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    Start Project
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35%</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills Learned</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+3 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Progress chart would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
