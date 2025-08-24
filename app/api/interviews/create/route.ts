import type { NextRequest } from "next/server"

interface InterviewRequest {
  role: string
  company: string
  interviewType: string
  difficulty: string
  duration: string
}

interface Question {
  id: string
  text: string
  type: "behavioral" | "technical" | "situational" | "company-specific"
  difficulty: "easy" | "medium" | "hard"
  category: string
  expectedDuration: number
  tips: string[]
  sampleAnswer?: string
}

// Question banks organized by role and type
const questionBanks = {
  behavioral: [
    {
      text: "Tell me about yourself and your background.",
      category: "Introduction",
      difficulty: "easy" as const,
      expectedDuration: 3,
      tips: [
        "Keep it concise (2-3 minutes)",
        "Focus on relevant experience",
        "End with why you're interested in this role",
      ],
    },
    {
      text: "Describe a challenging project you worked on and how you overcame obstacles.",
      category: "Problem Solving",
      difficulty: "medium" as const,
      expectedDuration: 4,
      tips: ["Use the STAR method", "Focus on your specific contributions", "Highlight the impact of your solution"],
    },
    {
      text: "Tell me about a time you had to work with a difficult team member.",
      category: "Teamwork",
      difficulty: "medium" as const,
      expectedDuration: 4,
      tips: ["Show empathy and understanding", "Focus on resolution, not blame", "Demonstrate communication skills"],
    },
    {
      text: "Where do you see yourself in 5 years?",
      category: "Career Goals",
      difficulty: "easy" as const,
      expectedDuration: 2,
      tips: ["Align with company growth", "Show ambition but be realistic", "Mention skill development"],
    },
  ],
  technical: {
    "frontend-developer": [
      {
        text: "How would you optimize the performance of a React application?",
        category: "Performance",
        difficulty: "medium" as const,
        expectedDuration: 5,
        tips: [
          "Mention specific techniques",
          "Discuss React.memo, useMemo, useCallback",
          "Talk about bundle optimization",
        ],
      },
      {
        text: "Explain the difference between controlled and uncontrolled components in React.",
        category: "React Concepts",
        difficulty: "easy" as const,
        expectedDuration: 3,
        tips: ["Provide clear definitions", "Give examples of each", "Mention when to use which approach"],
      },
      {
        text: "How would you implement state management in a large React application?",
        category: "State Management",
        difficulty: "hard" as const,
        expectedDuration: 6,
        tips: ["Compare different solutions", "Discuss Redux, Context, Zustand", "Consider scalability"],
      },
    ],
    "backend-developer": [
      {
        text: "How would you design a RESTful API for a social media platform?",
        category: "API Design",
        difficulty: "medium" as const,
        expectedDuration: 6,
        tips: ["Follow REST principles", "Consider authentication", "Think about scalability"],
      },
      {
        text: "Explain the difference between SQL and NoSQL databases and when to use each.",
        category: "Databases",
        difficulty: "easy" as const,
        expectedDuration: 4,
        tips: ["Highlight key differences", "Provide use case examples", "Mention specific technologies"],
      },
    ],
    "full-stack-developer": [
      {
        text: "Walk me through how you would build a real-time chat application.",
        category: "System Design",
        difficulty: "hard" as const,
        expectedDuration: 8,
        tips: ["Consider both frontend and backend", "Discuss WebSockets", "Think about scalability and data storage"],
      },
    ],
  },
  "company-specific": {
    google: [
      {
        text: "How would you improve Google Search?",
        category: "Product Thinking",
        difficulty: "hard" as const,
        expectedDuration: 6,
        tips: ["Consider user needs", "Think about technical constraints", "Propose measurable improvements"],
      },
    ],
    microsoft: [
      {
        text: "How would you integrate AI into Microsoft Office products?",
        category: "Product Innovation",
        difficulty: "medium" as const,
        expectedDuration: 5,
        tips: ["Consider existing features", "Think about user workflows", "Propose practical AI applications"],
      },
    ],
  },
}

function generateQuestions(request: InterviewRequest): Question[] {
  const { role, company, interviewType, difficulty, duration } = request
  const durationMinutes = Number.parseInt(duration)
  const questions: Question[] = []

  // Calculate number of questions based on duration
  const avgQuestionTime = 5 // minutes per question including thinking time
  const targetQuestionCount = Math.floor(durationMinutes / avgQuestionTime)

  if (interviewType === "behavioral" || interviewType === "mixed") {
    const behavioralCount = interviewType === "mixed" ? Math.ceil(targetQuestionCount * 0.4) : targetQuestionCount
    const behavioralQuestions = questionBanks.behavioral
      .filter((q) => difficulty === "easy" || q.difficulty !== "hard")
      .slice(0, behavioralCount)

    behavioralQuestions.forEach((q, index) => {
      questions.push({
        id: `behavioral-${index}`,
        text: q.text,
        type: "behavioral",
        difficulty: q.difficulty,
        category: q.category,
        expectedDuration: q.expectedDuration,
        tips: q.tips,
      })
    })
  }

  if (interviewType === "technical" || interviewType === "mixed") {
    const technicalCount = interviewType === "mixed" ? Math.ceil(targetQuestionCount * 0.6) : targetQuestionCount
    const roleQuestions = (questionBanks.technical as any)[role] || []
    const technicalQuestions = roleQuestions
      .filter((q: any) => difficulty === "easy" || q.difficulty !== "hard")
      .slice(0, technicalCount)

    technicalQuestions.forEach((q: any, index: number) => {
      questions.push({
        id: `technical-${index}`,
        text: q.text,
        type: "technical",
        difficulty: q.difficulty,
        category: q.category,
        expectedDuration: q.expectedDuration,
        tips: q.tips,
      })
    })
  }

  // Add company-specific questions if company is selected
  if (company && company !== "generic") {
    const companyQuestions = (questionBanks["company-specific"] as any)[company] || []
    if (companyQuestions.length > 0) {
      const companyQuestion = companyQuestions[0]
      questions.push({
        id: `company-${company}`,
        text: companyQuestion.text,
        type: "company-specific",
        difficulty: companyQuestion.difficulty,
        category: companyQuestion.category,
        expectedDuration: companyQuestion.expectedDuration,
        tips: companyQuestion.tips,
      })
    }
  }

  return questions.slice(0, targetQuestionCount)
}

export async function POST(request: NextRequest) {
  try {
    const body: InterviewRequest = await request.json()

    // Validate required fields
    if (!body.role || !body.interviewType || !body.difficulty || !body.duration) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Creating mock interview for:", body.role, body.company)

    // Generate questions based on parameters
    const questions = generateQuestions(body)

    // Create mock interview object
    const mockInterview = {
      id: Date.now().toString(),
      role: body.role.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      company: body.company || "Generic Tech Company",
      duration: Number.parseInt(body.duration),
      questions,
      status: "scheduled",
      scheduledDate: new Date().toISOString(),
    }

    console.log("[v0] Generated", questions.length, "questions for interview")

    return Response.json({
      success: true,
      message: "Mock interview created successfully",
      ...mockInterview,
    })
  } catch (error) {
    console.error("Interview creation error:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to create mock interview",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
