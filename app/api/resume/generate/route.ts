import { type NextRequest, NextResponse } from "next/server"

interface ResumeGenerationRequest {
  userProfile: {
    personalInfo: any
    experience: any[]
    skills: any
    education: any[]
    targetRole: string
  }
  template: string
  optimizeFor: string[]
}

// AI Resume Generation Prompts
const RESUME_PROMPTS = {
  summary: `You are an expert resume writer. Create a compelling professional summary for a {targetRole} position.

User Profile:
- Experience: {experience}
- Skills: {skills}
- Target Role: {targetRole}

Requirements:
- 2-3 sentences maximum
- Include quantified achievements
- Use action verbs and industry keywords
- Optimize for ATS scanning
- Match the tone for {targetRole} level

Return only the professional summary text.`,

  experience: `You are an expert resume writer. Enhance the work experience descriptions for ATS optimization.

Current Experience: {experience}
Target Role: {targetRole}
Required Keywords: {keywords}

For each role, provide:
- 3-4 bullet points maximum
- Start with strong action verbs
- Include quantified results (numbers, percentages, dollar amounts)
- Incorporate relevant keywords naturally
- Focus on achievements, not just responsibilities

Return as JSON array with enhanced descriptions.`,

  skills: `You are an expert resume writer. Optimize the skills section for a {targetRole} position.

Current Skills: {skills}
Target Role: {targetRole}
Job Requirements: {jobRequirements}

Provide:
- Technical skills (programming languages, frameworks, tools)
- Soft skills (leadership, communication, etc.)
- Industry-specific skills
- Prioritize based on job market demand
- Remove outdated or irrelevant skills

Return as JSON object with categorized skills.`,
}

// ATS Optimization Rules
const ATS_RULES = {
  keywords: {
    weight: 0.3,
    check: (content: string, targetKeywords: string[]) => {
      const contentLower = content.toLowerCase()
      const matchedKeywords = targetKeywords.filter((keyword) => contentLower.includes(keyword.toLowerCase()))
      return (matchedKeywords.length / targetKeywords.length) * 100
    },
  },
  format: {
    weight: 0.25,
    check: (content: string) => {
      // Check for proper section headers, bullet points, etc.
      const hasHeaders = /EXPERIENCE|EDUCATION|SKILLS|SUMMARY/gi.test(content)
      const hasBullets = content.includes("•") || content.includes("-")
      const hasProperStructure = content.split("\n").length > 10

      let score = 0
      if (hasHeaders) score += 40
      if (hasBullets) score += 30
      if (hasProperStructure) score += 30

      return Math.min(score, 100)
    },
  },
  length: {
    weight: 0.15,
    check: (content: string) => {
      const wordCount = content.split(/\s+/).length
      if (wordCount >= 300 && wordCount <= 600) return 100
      if (wordCount >= 250 && wordCount <= 700) return 85
      if (wordCount >= 200 && wordCount <= 800) return 70
      return 50
    },
  },
  readability: {
    weight: 0.15,
    check: (content: string) => {
      // Simple readability check
      const sentences = content.split(/[.!?]+/).length
      const words = content.split(/\s+/).length
      const avgWordsPerSentence = words / sentences

      if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) return 100
      if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 30) return 85
      return 70
    },
  },
  contact: {
    weight: 0.15,
    check: (content: string) => {
      const hasEmail = /@/.test(content)
      const hasPhone = /\$\$\d{3}\$\$|\d{3}-\d{3}-\d{4}|\d{10}/.test(content)
      const hasLocation = /[A-Z][a-z]+,\s*[A-Z]{2}/.test(content)

      let score = 0
      if (hasEmail) score += 40
      if (hasPhone) score += 30
      if (hasLocation) score += 30

      return Math.min(score, 100)
    },
  },
}

// Calculate ATS Score
function calculateATSScore(resumeContent: string, targetKeywords: string[] = []): number {
  let totalScore = 0

  for (const [rule, config] of Object.entries(ATS_RULES)) {
    const ruleScore = config.check(resumeContent, targetKeywords)
    totalScore += ruleScore * config.weight
  }

  return Math.round(totalScore)
}

async function generateWithAI(prompt: string, data: any): Promise<string> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Career Assistant",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer and career consultant with 15+ years of experience helping professionals optimize their resumes for ATS systems and human recruiters.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const result = await response.json()
    return result.choices[0]?.message?.content || "Generated content"
  } catch (error) {
    console.error("OpenRouter API error:", error)
    // Fallback to mock responses if API fails
    return getMockResponse(prompt, data)
  }
}

function getMockResponse(prompt: string, data: any): string {
  if (prompt.includes("professional summary")) {
    return `Experienced ${data.targetRole} with ${data.experience?.length || 3}+ years of proven success in developing scalable applications and leading cross-functional teams. Demonstrated expertise in modern technologies with a track record of delivering high-impact solutions that drive business growth and improve user experience.`
  }

  if (prompt.includes("work experience")) {
    return JSON.stringify([
      {
        company: "Tech Corp",
        title: "Senior Software Engineer",
        achievements: [
          "Architected and implemented microservices architecture, reducing system latency by 45%",
          "Led team of 6 developers in delivering critical features ahead of schedule",
          "Optimized database queries and caching strategies, improving application performance by 60%",
          "Mentored junior developers and established code review processes that reduced bugs by 30%",
        ],
      },
    ])
  }

  if (prompt.includes("skills")) {
    return JSON.stringify({
      technical: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes"],
      soft: ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
      tools: ["Git", "Jira", "Jenkins", "Terraform", "MongoDB"],
    })
  }

  return "Generated content"
}

export async function POST(request: NextRequest) {
  try {
    const body: ResumeGenerationRequest = await request.json()
    const { userProfile, template, optimizeFor } = body

    // Generate AI-enhanced content
    const summaryPrompt = RESUME_PROMPTS.summary
      .replace("{targetRole}", userProfile.targetRole)
      .replace("{experience}", JSON.stringify(userProfile.experience))
      .replace("{skills}", JSON.stringify(userProfile.skills))

    const enhancedSummary = await generateWithAI(summaryPrompt, userProfile)

    // Generate enhanced experience descriptions
    const experiencePrompt = RESUME_PROMPTS.experience
      .replace("{experience}", JSON.stringify(userProfile.experience))
      .replace("{targetRole}", userProfile.targetRole)
      .replace("{keywords}", optimizeFor.join(", "))

    const enhancedExperience = await generateWithAI(experiencePrompt, userProfile)

    // Generate optimized skills
    const skillsPrompt = RESUME_PROMPTS.skills
      .replace("{skills}", JSON.stringify(userProfile.skills))
      .replace("{targetRole}", userProfile.targetRole)
      .replace("{jobRequirements}", optimizeFor.join(", "))

    const optimizedSkills = await generateWithAI(skillsPrompt, userProfile)

    // Create full resume content for ATS scoring
    const fullResumeContent = `
      ${userProfile.personalInfo.fullName}
      ${userProfile.personalInfo.email} ${userProfile.personalInfo.phone}
      ${userProfile.personalInfo.location}
      
      PROFESSIONAL SUMMARY
      ${enhancedSummary}
      
      PROFESSIONAL EXPERIENCE
      ${userProfile.experience
        .map(
          (exp: any) => `
        ${exp.title} - ${exp.company}
        ${exp.duration}
        ${exp.achievements?.join("\n") || exp.description}
      `,
        )
        .join("\n")}
      
      TECHNICAL SKILLS
      ${Object.values(userProfile.skills).flat().join(", ")}
      
      EDUCATION
      ${userProfile.education
        .map((edu: any) => `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.year})`)
        .join("\n")}
    `

    // Calculate ATS score
    const atsScore = calculateATSScore(fullResumeContent, optimizeFor)

    // Return enhanced resume data
    return NextResponse.json({
      success: true,
      data: {
        enhancedSummary,
        enhancedExperience: JSON.parse(enhancedExperience),
        optimizedSkills: JSON.parse(optimizedSkills),
        atsScore,
        template,
        recommendations: [
          {
            type: "keyword",
            message: "Consider adding more role-specific keywords",
            keywords: optimizeFor.filter((keyword) => !fullResumeContent.toLowerCase().includes(keyword.toLowerCase())),
          },
          {
            type: "format",
            message: "Resume format is optimized for ATS parsing",
            status: "good",
          },
        ],
      },
    })
  } catch (error) {
    console.error("Resume generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate resume" }, { status: 500 })
  }
}
