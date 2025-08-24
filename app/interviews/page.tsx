"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Play,
  Square,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react"

interface Question {
  id: string
  text: string
  type: "behavioral" | "technical" | "situational" | "company-specific"
  difficulty: "easy" | "medium" | "hard"
  category: string
  expectedDuration: number
  sampleAnswer?: string
  tips: string[]
}

interface MockInterview {
  id: string
  role: string
  company: string
  duration: number
  questions: Question[]
  status: "scheduled" | "in-progress" | "completed"
  score?: number
  feedback?: InterviewFeedback
  recordingUrl?: string
  scheduledDate?: string
}

interface InterviewFeedback {
  overallScore: number
  categories: {
    communication: number
    technical: number
    problemSolving: number
    cultural: number
  }
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
  nextSteps: string[]
}

interface InterviewSession {
  currentQuestionIndex: number
  answers: { questionId: string; answer: string; duration: number }[]
  startTime: Date
  isRecording: boolean
  audioEnabled: boolean
  videoEnabled: boolean
}

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState("practice")
  const [mockInterviews, setMockInterviews] = useState<MockInterview[]>([])
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null)
  const [selectedInterview, setSelectedInterview] = useState<MockInterview | null>(null)
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [questionTimer, setQuestionTimer] = useState(0)

  // Form state for creating new mock interview
  const [interviewForm, setInterviewForm] = useState({
    role: "",
    company: "",
    interviewType: "",
    difficulty: "",
    duration: "",
  })

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadMockInterviews()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (isInterviewActive && currentSession) {
      timerRef.current = setInterval(() => {
        setQuestionTimer((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isInterviewActive, currentSession])

  const loadMockInterviews = async () => {
    // Mock data - in real app, fetch from API
    const mockData: MockInterview[] = [
      {
        id: "1",
        role: "Frontend Developer",
        company: "Google",
        duration: 45,
        status: "completed",
        score: 85,
        questions: [
          {
            id: "q1",
            text: "Tell me about yourself and your experience with React.",
            type: "behavioral",
            difficulty: "easy",
            category: "Introduction",
            expectedDuration: 3,
            tips: ["Keep it concise", "Focus on relevant experience", "Show enthusiasm"],
          },
          {
            id: "q2",
            text: "How would you optimize the performance of a React application?",
            type: "technical",
            difficulty: "medium",
            category: "Performance",
            expectedDuration: 5,
            tips: ["Mention specific techniques", "Provide examples", "Discuss trade-offs"],
          },
        ],
        feedback: {
          overallScore: 85,
          categories: {
            communication: 90,
            technical: 80,
            problemSolving: 85,
            cultural: 88,
          },
          strengths: ["Clear communication", "Good technical knowledge", "Structured thinking"],
          improvements: ["More specific examples", "Deeper technical details", "Ask clarifying questions"],
          detailedFeedback:
            "Strong performance overall. Your communication skills are excellent and you demonstrated solid technical knowledge. Consider providing more specific examples from your experience.",
          nextSteps: [
            "Practice system design questions",
            "Review advanced React patterns",
            "Prepare STAR method examples",
          ],
        },
      },
      {
        id: "2",
        role: "Full-Stack Developer",
        company: "Microsoft",
        duration: 60,
        status: "scheduled",
        scheduledDate: "2024-03-15T14:00:00Z",
        questions: [],
      },
    ]
    setMockInterviews(mockData)
  }

  const createMockInterview = async () => {
    try {
      const response = await fetch("/api/interviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewForm),
      })

      if (response.ok) {
        const newInterview = await response.json()
        setMockInterviews([newInterview, ...mockInterviews])
        setInterviewForm({ role: "", company: "", interviewType: "", difficulty: "", duration: "" })
      }
    } catch (error) {
      console.error("Failed to create mock interview:", error)
    }
  }

  const startInterview = (interview: MockInterview) => {
    setSelectedInterview(interview)
    setCurrentSession({
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      isRecording: false,
      audioEnabled: true,
      videoEnabled: false,
    })
    setIsInterviewActive(true)
    setQuestionTimer(0)
  }

  const nextQuestion = () => {
    if (!currentSession || !selectedInterview) return

    // Save current answer
    const currentQuestion = selectedInterview.questions[currentSession.currentQuestionIndex]
    const newAnswer = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      duration: questionTimer,
    }

    const updatedSession = {
      ...currentSession,
      answers: [...currentSession.answers, newAnswer],
      currentQuestionIndex: currentSession.currentQuestionIndex + 1,
    }

    setCurrentSession(updatedSession)
    setCurrentAnswer("")
    setQuestionTimer(0)

    // Check if interview is complete
    if (updatedSession.currentQuestionIndex >= selectedInterview.questions.length) {
      completeInterview(updatedSession)
    }
  }

  const completeInterview = async (session: InterviewSession) => {
    setIsInterviewActive(false)

    try {
      const response = await fetch("/api/interviews/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: selectedInterview?.id,
          answers: session.answers,
          totalDuration: Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000 / 60),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Update interview with results
        setMockInterviews(
          mockInterviews.map((interview) =>
            interview.id === selectedInterview?.id
              ? { ...interview, status: "completed", score: result.score, feedback: result.feedback }
              : interview,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to complete interview:", error)
    }

    setCurrentSession(null)
    setSelectedInterview(null)
  }

  const toggleRecording = () => {
    if (!currentSession) return
    setCurrentSession({ ...currentSession, isRecording: !currentSession.isRecording })
  }

  const toggleAudio = () => {
    if (!currentSession) return
    setCurrentSession({ ...currentSession, audioEnabled: !currentSession.audioEnabled })
  }

  const toggleVideo = () => {
    if (!currentSession) return
    setCurrentSession({ ...currentSession, videoEnabled: !currentSession.videoEnabled })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Preparation</h1>
        <p className="text-gray-600">Practice with AI-powered mock interviews and get personalized feedback</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          {!isInterviewActive ? (
            <>
              {/* Create New Interview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-600" />
                    Start New Mock Interview
                  </CardTitle>
                  <CardDescription>Create a personalized interview session based on your target role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role">Target Role</Label>
                      <Select
                        value={interviewForm.role}
                        onValueChange={(value) => setInterviewForm({ ...interviewForm, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                          <SelectItem value="backend-developer">Backend Developer</SelectItem>
                          <SelectItem value="full-stack-developer">Full-Stack Developer</SelectItem>
                          <SelectItem value="data-scientist">Data Scientist</SelectItem>
                          <SelectItem value="product-manager">Product Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Select
                        value={interviewForm.company}
                        onValueChange={(value) => setInterviewForm({ ...interviewForm, company: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="microsoft">Microsoft</SelectItem>
                          <SelectItem value="amazon">Amazon</SelectItem>
                          <SelectItem value="meta">Meta</SelectItem>
                          <SelectItem value="netflix">Netflix</SelectItem>
                          <SelectItem value="generic">Generic Tech Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interviewType">Interview Type</Label>
                      <Select
                        value={interviewForm.interviewType}
                        onValueChange={(value) => setInterviewForm({ ...interviewForm, interviewType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="system-design">System Design</SelectItem>
                          <SelectItem value="mixed">Mixed (Recommended)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select
                        value={interviewForm.difficulty}
                        onValueChange={(value) => setInterviewForm({ ...interviewForm, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select
                        value={interviewForm.duration}
                        onValueChange={(value) => setInterviewForm({ ...interviewForm, duration: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={createMockInterview}
                    disabled={!interviewForm.role || !interviewForm.interviewType}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start AI Mock Interview
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Practice Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Behavioral</CardTitle>
                    <CardDescription>5 common behavioral questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">15 minutes</div>
                      <Button size="sm" onClick={() => startInterview(mockInterviews[0])}>
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Technical Deep Dive</CardTitle>
                    <CardDescription>Role-specific technical questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">30 minutes</div>
                      <Button size="sm" onClick={() => startInterview(mockInterviews[0])}>
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Company Specific</CardTitle>
                    <CardDescription>FAANG-style interview prep</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">45 minutes</div>
                      <Button size="sm" onClick={() => startInterview(mockInterviews[0])}>
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            /* Active Interview Interface */
            <div className="space-y-6">
              {/* Interview Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {selectedInterview?.role} Interview - {selectedInterview?.company}
                      </CardTitle>
                      <CardDescription>
                        Question {(currentSession?.currentQuestionIndex || 0) + 1} of{" "}
                        {selectedInterview?.questions.length}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-mono">{formatTime(questionTimer)}</div>
                      <Button variant="outline" size="sm" onClick={() => setIsInterviewActive(false)}>
                        <Square className="mr-2 h-4 w-4" />
                        End Interview
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={
                      ((currentSession?.currentQuestionIndex || 0) / (selectedInterview?.questions.length || 1)) * 100
                    }
                  />
                </CardHeader>
              </Card>

              {/* Current Question */}
              {selectedInterview && currentSession && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Current Question</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            selectedInterview.questions[currentSession.currentQuestionIndex]?.difficulty === "easy"
                              ? "secondary"
                              : selectedInterview.questions[currentSession.currentQuestionIndex]?.difficulty ===
                                  "medium"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {selectedInterview.questions[currentSession.currentQuestionIndex]?.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {selectedInterview.questions[currentSession.currentQuestionIndex]?.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-lg font-medium">
                        {selectedInterview.questions[currentSession.currentQuestionIndex]?.text}
                      </p>
                    </div>

                    {/* Recording Controls */}
                    <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Button
                        variant={currentSession.audioEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={toggleAudio}
                      >
                        {currentSession.audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={currentSession.videoEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={toggleVideo}
                      >
                        {currentSession.videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={currentSession.isRecording ? "destructive" : "default"}
                        onClick={toggleRecording}
                      >
                        {currentSession.isRecording ? (
                          <>
                            <Square className="mr-2 h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Answer Input */}
                    <div className="space-y-2">
                      <Label htmlFor="answer">Your Answer (Optional - for text practice)</Label>
                      <Textarea
                        id="answer"
                        placeholder="Type your answer here or speak aloud if recording..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-600" />
                        Tips for this question:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {selectedInterview.questions[currentSession.currentQuestionIndex]?.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={nextQuestion} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                        {currentSession.currentQuestionIndex < selectedInterview.questions.length - 1
                          ? "Next Question"
                          : "Complete Interview"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Interview History</h2>
            {mockInterviews.map((interview) => (
              <Card key={interview.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {interview.role} - {interview.company}
                      </CardTitle>
                      <CardDescription>
                        {interview.status === "completed"
                          ? `Completed • Score: ${interview.score}%`
                          : interview.status === "scheduled"
                            ? `Scheduled for ${new Date(interview.scheduledDate!).toLocaleDateString()}`
                            : "In Progress"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        interview.status === "completed"
                          ? "default"
                          : interview.status === "scheduled"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {interview.status}
                    </Badge>
                  </div>
                </CardHeader>
                {interview.feedback && (
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">
                          {interview.feedback.categories.communication}
                        </div>
                        <div className="text-sm text-gray-500">Communication</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">
                          {interview.feedback.categories.technical}
                        </div>
                        <div className="text-sm text-gray-500">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">
                          {interview.feedback.categories.problemSolving}
                        </div>
                        <div className="text-sm text-gray-500">Problem Solving</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">{interview.feedback.categories.cultural}</div>
                        <div className="text-sm text-gray-500">Cultural Fit</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Strengths:</h4>
                        <ul className="text-sm space-y-1">
                          {interview.feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">Areas for Improvement:</h4>
                        <ul className="text-sm space-y-1">
                          {interview.feedback.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button variant="outline" size="sm">
                        View Detailed Report
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+4 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Practice Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Communication", score: 85 },
                  { name: "Technical Skills", score: 78 },
                  { name: "Problem Solving", score: 82 },
                  { name: "Cultural Fit", score: 90 },
                ].map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">{category.score}%</span>
                    </div>
                    <Progress value={category.score} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Question Bank</CardTitle>
                <CardDescription>Browse questions by category and difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600">150+</div>
                      <div className="text-sm text-gray-500">Behavioral</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600">200+</div>
                      <div className="text-sm text-gray-500">Technical</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Browse Questions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Insights</CardTitle>
                <CardDescription>Learn about specific company interview processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Google", "Microsoft", "Amazon", "Meta", "Netflix"].map((company) => (
                    <div key={company} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{company}</span>
                      <Button size="sm" variant="outline">
                        View Guide
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
