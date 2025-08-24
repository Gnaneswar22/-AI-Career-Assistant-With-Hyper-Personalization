import { type NextRequest, NextResponse } from "next/server"

interface ATSCheckRequest {
  resumeContent: string
  targetRole: string
  targetKeywords?: string[]
}

interface ATSCheckResult {
  overallScore: number
  checks: Array<{
    name: string
    score: number
    status: "pass" | "warning" | "fail"
    details: string
    suggestions?: string[]
  }>
  recommendations: Array<{
    type: string
    priority: "high" | "medium" | "low"
    message: string
    action: string
  }>
}

// Comprehensive ATS Analysis Rules
const ATS_ANALYSIS_RULES = {
  contactInformation: {
    name: "Contact Information",
    weight: 0.15,
    check: (content: string) => {
      const checks = {
        email: /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(content),
        phone: /(\+?1[-.\s]?)?$$?[0-9]{3}$$?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/.test(content),
        location: /[A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+\s*[A-Z][a-z]+/.test(content),
      }

      const passedChecks = Object.values(checks).filter(Boolean).length
      const score = (passedChecks / 3) * 100

      return {
        score: Math.round(score),
        status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
        details: `Found ${passedChecks}/3 required contact elements`,
        suggestions:
          score < 100
            ? [
                !checks.email && "Add a professional email address",
                !checks.phone && "Include a phone number",
                !checks.location && "Add your city and state",
              ].filter(Boolean)
            : [],
      }
    },
  },

  sectionHeaders: {
    name: "Section Headers",
    weight: 0.12,
    check: (content: string) => {
      const requiredSections = [
        /EXPERIENCE|WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE/i,
        /EDUCATION/i,
        /SKILLS|TECHNICAL\s+SKILLS/i,
        /SUMMARY|PROFESSIONAL\s+SUMMARY|OBJECTIVE/i,
      ]

      const foundSections = requiredSections.filter((section) => section.test(content)).length
      const score = (foundSections / requiredSections.length) * 100

      return {
        score: Math.round(score),
        status: score >= 75 ? "pass" : score >= 50 ? "warning" : "fail",
        details: `Found ${foundSections}/${requiredSections.length} standard section headers`,
        suggestions:
          score < 100
            ? [
                "Use standard section headers like 'PROFESSIONAL EXPERIENCE', 'EDUCATION', 'SKILLS'",
                "Ensure section headers are in ALL CAPS or bold formatting",
              ]
            : [],
      }
    },
  },

  keywordOptimization: {
    name: "Keyword Optimization",
    weight: 0.25,
    check: (content: string, targetKeywords: string[] = []) => {
      if (targetKeywords.length === 0) {
        return {
          score: 75,
          status: "warning" as const,
          details: "No target keywords provided for analysis",
          suggestions: ["Provide job-specific keywords for better optimization"],
        }
      }

      const contentLower = content.toLowerCase()
      const matchedKeywords = targetKeywords.filter((keyword) => contentLower.includes(keyword.toLowerCase()))

      const score = (matchedKeywords.length / targetKeywords.length) * 100

      return {
        score: Math.round(score),
        status: score >= 70 ? "pass" : score >= 50 ? "warning" : "fail",
        details: `Matched ${matchedKeywords.length}/${targetKeywords.length} target keywords`,
        suggestions:
          score < 100
            ? [
                `Consider adding these keywords: ${targetKeywords
                  .filter((k) => !contentLower.includes(k.toLowerCase()))
                  .slice(0, 5)
                  .join(", ")}`,
                "Integrate keywords naturally into your experience descriptions",
              ]
            : [],
      }
    },
  },

  formatting: {
    name: "Font & Formatting",
    weight: 0.15,
    check: (content: string) => {
      const checks = {
        bulletPoints: /[•\-*]/.test(content),
        properSpacing: content.includes("\n\n") || content.includes("\n "),
        noSpecialChars: !/[^\w\s\n\r\t.,;:()\-•@/]/.test(content),
        consistentFormat: true, // Simplified check
      }

      const passedChecks = Object.values(checks).filter(Boolean).length
      const score = (passedChecks / 4) * 100

      return {
        score: Math.round(score),
        status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
        details: `Formatting score: ${Math.round(score)}%`,
        suggestions:
          score < 100
            ? [
                !checks.bulletPoints && "Use bullet points for experience items",
                !checks.properSpacing && "Ensure proper spacing between sections",
                !checks.noSpecialChars && "Avoid special characters that may cause parsing issues",
              ].filter(Boolean)
            : [],
      }
    },
  },

  contentLength: {
    name: "Length & Content",
    weight: 0.13,
    check: (content: string) => {
      const wordCount = content.trim().split(/\s+/).length
      const lineCount = content.split("\n").filter((line) => line.trim()).length

      let score = 0
      let details = ""
      const suggestions: string[] = []

      if (wordCount >= 300 && wordCount <= 800) {
        score = 100
        details = `Optimal length: ${wordCount} words`
      } else if (wordCount >= 250 && wordCount <= 1000) {
        score = 85
        details = `Good length: ${wordCount} words`
      } else if (wordCount < 250) {
        score = 60
        details = `Too short: ${wordCount} words`
        suggestions.push("Add more detail to your experience and achievements")
      } else {
        score = 70
        details = `Too long: ${wordCount} words`
        suggestions.push("Consider condensing content to 1-2 pages")
      }

      return {
        score,
        status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
        details,
        suggestions,
      }
    },
  },

  achievementFocus: {
    name: "Achievement Focus",
    weight: 0.2,
    check: (content: string) => {
      const achievementIndicators = [
        /\d+%/g, // Percentages
        /\$[\d,]+/g, // Dollar amounts
        /\d+\s*(million|thousand|k|m)/gi, // Large numbers
        /(increased|decreased|improved|reduced|grew|saved|generated)/gi, // Action verbs
        /\d+\s*(users|customers|clients|projects|teams)/gi, // Scale indicators
      ]

      let totalMatches = 0
      achievementIndicators.forEach((indicator) => {
        const matches = content.match(indicator)
        if (matches) totalMatches += matches.length
      })

      // Score based on density of quantified achievements
      const wordCount = content.split(/\s+/).length
      const achievementDensity = (totalMatches / wordCount) * 1000 // Per 1000 words

      let score = 0
      if (achievementDensity >= 15) score = 100
      else if (achievementDensity >= 10) score = 85
      else if (achievementDensity >= 5) score = 70
      else score = 50

      return {
        score: Math.round(score),
        status: score >= 75 ? "pass" : score >= 60 ? "warning" : "fail",
        details: `Found ${totalMatches} quantified achievements`,
        suggestions:
          score < 85
            ? [
                "Add more quantified achievements with specific numbers and percentages",
                "Use action verbs like 'increased', 'improved', 'led', 'developed'",
                "Include metrics like revenue impact, team size, or performance improvements",
              ]
            : [],
      }
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, targetRole, targetKeywords = [] }: ATSCheckRequest = await request.json()

    if (!resumeContent) {
      return NextResponse.json({ success: false, error: "Resume content is required" }, { status: 400 })
    }

    // Run all ATS checks
    const checks = Object.entries(ATS_ANALYSIS_RULES).map(([key, rule]) => {
      const result = rule.check(resumeContent, targetKeywords)
      return {
        name: rule.name,
        ...result,
      }
    })

    // Calculate overall score
    const overallScore = Math.round(
      Object.entries(ATS_ANALYSIS_RULES).reduce((total, [key, rule]) => {
        const check = checks.find((c) => c.name === rule.name)
        return total + (check?.score || 0) * rule.weight
      }, 0),
    )

    // Generate recommendations
    const recommendations = checks
      .filter((check) => check.status !== "pass")
      .map((check) => ({
        type: check.name.toLowerCase().replace(/\s+/g, "_"),
        priority: (check.status === "fail" ? "high" : "medium") as "high" | "medium" | "low",
        message: check.details,
        action: check.suggestions?.[0] || "Review and improve this section",
      }))
      .slice(0, 5) // Limit to top 5 recommendations

    // Add role-specific recommendations
    if (targetRole) {
      const roleKeywords = getRoleSpecificKeywords(targetRole)
      const missingKeywords = roleKeywords.filter(
        (keyword) => !resumeContent.toLowerCase().includes(keyword.toLowerCase()),
      )

      if (missingKeywords.length > 0) {
        recommendations.unshift({
          type: "role_optimization",
          priority: "high",
          message: `Missing key ${targetRole} skills`,
          action: `Consider adding: ${missingKeywords.slice(0, 3).join(", ")}`,
        })
      }
    }

    const result: ATSCheckResult = {
      overallScore,
      checks,
      recommendations,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("ATS check error:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze resume" }, { status: 500 })
  }
}

// Helper function to get role-specific keywords
function getRoleSpecificKeywords(role: string): string[] {
  const roleKeywords: Record<string, string[]> = {
    "software engineer": ["JavaScript", "Python", "React", "Node.js", "Git", "Agile", "API", "Database"],
    "data scientist": ["Python", "R", "Machine Learning", "SQL", "Statistics", "Pandas", "Scikit-learn", "Tableau"],
    "product manager": ["Product Strategy", "Roadmap", "Stakeholder", "Analytics", "User Research", "Agile", "KPIs"],
    "ux designer": ["User Experience", "Figma", "Prototyping", "User Research", "Wireframes", "Design Systems"],
    "marketing manager": ["Digital Marketing", "SEO", "Analytics", "Campaign Management", "Social Media", "Content"],
  }

  const roleLower = role.toLowerCase()
  for (const [key, keywords] of Object.entries(roleKeywords)) {
    if (roleLower.includes(key)) {
      return keywords
    }
  }

  return [] // Return empty array if role not found
}
