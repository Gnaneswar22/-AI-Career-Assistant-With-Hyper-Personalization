import type { NextRequest } from "next/server"

interface CompleteInterviewRequest {
  interviewId: string
  answers: {
    questionId: string
    answer: string
    duration: number
  }[]
  totalDuration: number
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

// AI-powered feedback generation (mock implementation)
function generateInterviewFeedback(answers: any[], totalDuration: number): InterviewFeedback {
  // In a real implementation, this would use AI/ML models to analyze:
  // - Speech patterns and clarity (if audio recorded)
  // - Answer quality and relevance
  // - Technical accuracy
  // - Communication effectiveness
  // - Time management

  // Mock scoring based on answer length and duration
  const avgAnswerLength = answers.reduce((sum, answer) => sum + answer.answer.length, 0) / answers.length
  const avgAnswerDuration = answers.reduce((sum, answer) => sum + answer.duration, 0) / answers.length

  // Generate scores (mock logic)
  const communicationScore = Math.min(95, Math.max(60, 70 + (avgAnswerLength / 50) * 10))
  const technicalScore = Math.min(90, Math.max(50, 65 + Math.random() * 20))
  const problemSolvingScore = Math.min(95, Math.max(55, 70 + (avgAnswerDuration / 180) * 15))
  const culturalScore = Math.min(95, Math.max(65, 75 + Math.random() * 15))

  const overallScore = Math.round((communicationScore + technicalScore + problemSolvingScore + culturalScore) / 4)

  // Generate contextual feedback
  const strengths = []
  const improvements = []
  const nextSteps = []

  if (communicationScore >= 80) {
    strengths.push("Clear and articulate communication")
    strengths.push("Good structure in responses")
  } else {
    improvements.push("Work on clarity and conciseness")
    nextSteps.push("Practice the STAR method for behavioral questions")
  }

  if (technicalScore >= 75) {
    strengths.push("Solid technical knowledge")
  } else {
    improvements.push("Deepen technical understanding")
    nextSteps.push("Review core concepts for your target role")
  }

  if (problemSolvingScore >= 80) {
    strengths.push("Strong analytical thinking")
  } else {
    improvements.push("Improve problem-solving approach")
    nextSteps.push("Practice breaking down complex problems")
  }

  if (avgAnswerDuration < 120) {
    improvements.push("Provide more detailed examples")
    nextSteps.push("Prepare specific examples using the STAR method")
  }

  if (avgAnswerDuration > 300) {
    improvements.push("Be more concise in responses")
    nextSteps.push("Practice timing your answers")
  }

  // Generate detailed feedback
  let detailedFeedback = `Overall, you demonstrated ${
    overallScore >= 80 ? "strong" : overallScore >= 70 ? "good" : "developing"
  } interview skills. `

  if (communicationScore >= 80) {
    detailedFeedback += "Your communication was clear and well-structured. "
  }

  if (technicalScore < 70) {
    detailedFeedback += "Consider reviewing technical concepts more thoroughly. "
  }

  detailedFeedback += "Continue practicing to build confidence and improve your interview performance."

  return {
    overallScore,
    categories: {
      communication: Math.round(communicationScore),
      technical: Math.round(technicalScore),
      problemSolving: Math.round(problemSolvingScore),
      cultural: Math.round(culturalScore),
    },
    strengths,
    improvements,
    detailedFeedback,
    nextSteps,
  }
}

// Generate improvement recommendations
function generateRecommendations(feedback: InterviewFeedback): string[] {
  const recommendations = []

  if (feedback.categories.communication < 75) {
    recommendations.push("Practice speaking clearly and at an appropriate pace")
    recommendations.push("Record yourself answering questions to improve delivery")
  }

  if (feedback.categories.technical < 70) {
    recommendations.push("Review fundamental concepts for your target role")
    recommendations.push("Practice coding problems on platforms like LeetCode")
  }

  if (feedback.categories.problemSolving < 75) {
    recommendations.push("Practice breaking down complex problems step by step")
    recommendations.push("Learn common problem-solving frameworks")
  }

  if (feedback.categories.cultural < 80) {
    recommendations.push("Research the company culture and values")
    recommendations.push("Prepare examples that demonstrate cultural fit")
  }

  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const body: CompleteInterviewRequest = await request.json()

    if (!body.interviewId || !body.answers) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Processing interview completion for:", body.interviewId)
    console.log("[v0] Analyzing", body.answers.length, "answers")

    // Generate AI-powered feedback
    const feedback = generateInterviewFeedback(body.answers, body.totalDuration)

    // Generate personalized recommendations
    const recommendations = generateRecommendations(feedback)

    // In a real implementation, save results to database
    // await saveInterviewResults(body.interviewId, feedback, body.answers)

    console.log("[v0] Generated feedback with overall score:", feedback.overallScore)

    return Response.json({
      success: true,
      message: "Interview completed successfully",
      score: feedback.overallScore,
      feedback,
      recommendations,
    })
  } catch (error) {
    console.error("Interview completion error:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to process interview completion",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
