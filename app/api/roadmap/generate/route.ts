import type { NextRequest } from "next/server"

interface RoadmapRequest {
  targetRole: string
  currentSkills: string
  experience: string
  timeCommitment: string
  learningStyle: string
}

interface Skill {
  name: string
  currentLevel: number
  targetLevel: number
  priority: "high" | "medium" | "low"
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

async function generateWithOpenRouter(prompt: string) {
  try {
    const apiKey = "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"

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Career Assistant",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert career advisor and learning path designer. Generate detailed, practical, and current learning resources. Always return valid JSON when requested. Create original content only - do not reference external copyrighted materials.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenRouter API error: ${response.status} - ${errorText}`)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ""

    if (!content) {
      throw new Error("No content generated")
    }

    return content
  } catch (error) {
    console.error("OpenRouter API error:", error)
    throw error
  }
}

async function generateRoadmapContent(request: RoadmapRequest) {
  const { targetRole, currentSkills, experience, timeCommitment, learningStyle } = request

  const skillGapsPrompt = `
    Analyze the complete skill requirements for becoming a DOMAIN EXPERT in ${targetRole}.
    Current skills: ${currentSkills}
    Experience level: ${experience}
    
    Generate a comprehensive skill analysis covering ALL aspects needed for domain expertise:
    - Core technical skills
    - Advanced specialized skills
    - Industry tools and technologies
    - Soft skills and leadership
    - Emerging trends and technologies
    
    Return ONLY a valid JSON array with this exact format:
    [{"name": "skill_name", "currentLevel": 0-10, "targetLevel": 8-10, "priority": "high|medium|low"}]
    
    Include 15-20 skills for complete domain mastery.
  `

  const skillGapsResponse = await generateWithOpenRouter(skillGapsPrompt)
  let skillGaps: Skill[] = []

  try {
    const cleanResponse = skillGapsResponse.replace(/```json|```/g, "").trim()
    skillGaps = JSON.parse(cleanResponse)
  } catch (error) {
    console.error("Failed to parse skill gaps:", error)
    skillGaps = getDomainSpecificSkills(targetRole)
  }

  // Generate comprehensive milestones for domain expertise
  const milestones = await generateAIMilestones(targetRole, experience, skillGaps, learningStyle, timeCommitment)

  const totalWeeks = milestones.reduce((sum, milestone) => sum + milestone.estimatedWeeks, 0)

  return {
    id: Date.now().toString(),
    title: `${targetRole.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Expert Roadmap`,
    targetRole: targetRole.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    totalWeeks,
    completionPercentage: 0,
    milestones,
    skillGaps: skillGaps.filter((gap) => gap.currentLevel < gap.targetLevel),
  }
}

async function generateAIMilestones(
  targetRole: string,
  experience: string,
  skillGaps: Skill[],
  learningStyle: string,
  timeCommitment: string,
): Promise<Milestone[]> {
  const milestonesPrompt = `
    Create a comprehensive DOMAIN EXPERT learning roadmap for ${targetRole}:
    - Experience level: ${experience}
    - Time commitment: ${timeCommitment}
    - Learning style: ${learningStyle}
    - Skills to master: ${skillGaps.map((s) => s.name).join(", ")}
    
    Generate 6-8 progressive milestones that cover ALL aspects of domain expertise:
    1. Foundation & Core Concepts
    2. Intermediate Skills & Tools
    3. Advanced Technical Mastery
    4. Real-world Application & Projects
    5. Industry Best Practices
    6. Leadership & Communication
    7. Emerging Technologies & Innovation
    8. Expert-level Specialization
    
    Return ONLY valid JSON:
    [
      {
        "id": "milestone-1",
        "title": "Milestone Title",
        "description": "Comprehensive description of what will be mastered",
        "skills": ["skill1", "skill2", "skill3"],
        "estimatedWeeks": 4-12,
        "completed": false
      }
    ]
    
    Make it progressive from ${experience} to EXPERT level.
  `

  const milestonesResponse = await generateWithOpenRouter(milestonesPrompt)
  let milestones: any[] = []

  try {
    const cleanResponse = milestonesResponse.replace(/```json|```/g, "").trim()
    milestones = JSON.parse(cleanResponse)
  } catch (error) {
    console.error("Failed to parse milestones:", error)
    // Enhanced fallback milestones for domain expertise
    milestones = [
      {
        id: "milestone-1",
        title: "Foundation Mastery",
        description: "Master all core fundamentals and essential concepts",
        skills: skillGaps.slice(0, 4).map((s) => s.name),
        estimatedWeeks: 8,
        completed: false,
      },
      {
        id: "milestone-2",
        title: "Advanced Technical Skills",
        description: "Develop advanced technical capabilities and tool mastery",
        skills: skillGaps.slice(4, 8).map((s) => s.name),
        estimatedWeeks: 10,
        completed: false,
      },
      {
        id: "milestone-3",
        title: "Real-world Application",
        description: "Apply skills through comprehensive projects and case studies",
        skills: skillGaps.slice(8, 12).map((s) => s.name),
        estimatedWeeks: 12,
        completed: false,
      },
      {
        id: "milestone-4",
        title: "Expert-level Specialization",
        description: "Achieve domain expertise and thought leadership",
        skills: skillGaps.slice(12).map((s) => s.name),
        estimatedWeeks: 16,
        completed: false,
      },
    ]
  }

  // Generate comprehensive courses and projects for each milestone
  const enrichedMilestones = await Promise.all(
    milestones.map(async (milestone) => ({
      ...milestone,
      courses: await generateAICourses(milestone.skills, learningStyle, targetRole),
      projects: await generateAIProjects(milestone.skills, experience, targetRole),
    })),
  )

  return enrichedMilestones
}

async function generateAICourses(skills: string[], learningStyle: string, targetRole: string): Promise<Course[]> {
  const coursesPrompt = `
    Recommend 4-5 FREE comprehensive courses for ${targetRole} domain expertise in: ${skills.join(", ")}
    Learning style: ${learningStyle}
    
    Focus on courses that build EXPERT-level knowledge in the domain.
    Include diverse learning resources: video courses, interactive tutorials, documentation, books.
    
    Return ONLY valid JSON:
    [
      {
        "id": "course-1",
        "title": "Comprehensive Course Title",
        "provider": "YouTube/freeCodeCamp/Coursera/edX/MDN/Official Docs",
        "duration": "X hours",
        "rating": 4.5-4.9,
        "url": "https://example.com",
        "skills": ["skill1", "skill2"]
      }
    ]
    
    Prioritize FREE, expert-level resources.
  `

  const coursesResponse = await generateWithOpenRouter(coursesPrompt)

  try {
    const cleanResponse = coursesResponse.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanResponse)
  } catch (error) {
    console.error("Failed to parse courses:", error)
    // Enhanced fallback courses
    return [
      {
        id: "course-1",
        title: `Complete ${targetRole} Mastery Course`,
        provider: "freeCodeCamp",
        duration: "40 hours",
        rating: 4.8,
        url: "https://freecodecamp.org",
        skills: skills.slice(0, 3),
      },
      {
        id: "course-2",
        title: `Advanced ${targetRole} Concepts`,
        provider: "YouTube",
        duration: "25 hours",
        rating: 4.7,
        url: "https://youtube.com",
        skills: skills.slice(1, 4),
      },
    ]
  }
}

async function generateAIProjects(skills: string[], experience: string, targetRole: string): Promise<Project[]> {
  const projectsPrompt = `
    Design 3-4 comprehensive projects for ${targetRole} domain expertise using: ${skills.join(", ")}
    Experience level: ${experience}
    
    Create projects that demonstrate EXPERT-level mastery:
    - Real-world industry problems
    - Complex technical challenges
    - Portfolio-worthy implementations
    - Scalable and production-ready solutions
    
    Return ONLY valid JSON:
    [
      {
        "id": "project-1",
        "title": "Expert-level Project Title",
        "description": "Comprehensive project description with expert-level learning outcomes and industry relevance",
        "difficulty": "intermediate|advanced",
        "estimatedHours": 40-120,
        "skills": ["skill1", "skill2", "skill3"]
      }
    ]
    
    Make projects industry-relevant and expert-level.
  `

  const projectsResponse = await generateWithOpenRouter(projectsPrompt)

  try {
    const cleanResponse = projectsResponse.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanResponse)
  } catch (error) {
    console.error("Failed to parse projects:", error)
    // Enhanced fallback projects
    return [
      {
        id: "project-1",
        title: `Expert ${targetRole} Portfolio Project`,
        description: `Build a comprehensive, production-ready project that demonstrates expert-level mastery of ${skills.join(", ")}. This project should solve real industry problems and showcase advanced technical skills.`,
        difficulty: experience === "beginner" ? "intermediate" : "advanced",
        estimatedHours: 80,
        skills: skills.slice(0, 4),
      },
      {
        id: "project-2",
        title: `Advanced ${targetRole} System`,
        description: `Design and implement a complex system that demonstrates deep understanding of ${targetRole} principles and best practices.`,
        difficulty: "advanced",
        estimatedHours: 100,
        skills: skills.slice(2, 6),
      },
    ]
  }
}

function getDomainSpecificSkills(targetRole: string): Skill[] {
  const skillMaps: Record<string, Skill[]> = {
    "full-stack-developer": [
      { name: "Frontend Development (React/Vue/Angular)", currentLevel: 3, targetLevel: 9, priority: "high" },
      { name: "Backend Development (Node.js/Python/Java)", currentLevel: 2, targetLevel: 9, priority: "high" },
      { name: "Database Design & Management", currentLevel: 2, targetLevel: 8, priority: "high" },
      { name: "API Design & Development", currentLevel: 2, targetLevel: 8, priority: "high" },
      { name: "Cloud Platforms (AWS/Azure/GCP)", currentLevel: 1, targetLevel: 7, priority: "high" },
      { name: "DevOps & CI/CD", currentLevel: 1, targetLevel: 7, priority: "medium" },
      { name: "System Architecture", currentLevel: 1, targetLevel: 8, priority: "high" },
      { name: "Security Best Practices", currentLevel: 2, targetLevel: 8, priority: "high" },
      { name: "Performance Optimization", currentLevel: 2, targetLevel: 7, priority: "medium" },
      { name: "Testing Strategies", currentLevel: 2, targetLevel: 7, priority: "medium" },
      { name: "Microservices Architecture", currentLevel: 1, targetLevel: 7, priority: "medium" },
      { name: "Container Technologies (Docker/Kubernetes)", currentLevel: 1, targetLevel: 6, priority: "medium" },
      { name: "Monitoring & Logging", currentLevel: 1, targetLevel: 6, priority: "low" },
      { name: "Agile Development", currentLevel: 3, targetLevel: 7, priority: "medium" },
      { name: "Technical Leadership", currentLevel: 2, targetLevel: 8, priority: "medium" },
    ],
    "data-scientist": [
      { name: "Python/R Programming", currentLevel: 3, targetLevel: 9, priority: "high" },
      { name: "Machine Learning Algorithms", currentLevel: 2, targetLevel: 9, priority: "high" },
      { name: "Deep Learning & Neural Networks", currentLevel: 1, targetLevel: 8, priority: "high" },
      { name: "Statistical Analysis", currentLevel: 2, targetLevel: 8, priority: "high" },
      { name: "Data Visualization", currentLevel: 3, targetLevel: 8, priority: "high" },
      { name: "Big Data Technologies", currentLevel: 1, targetLevel: 7, priority: "medium" },
      { name: "SQL & Database Management", currentLevel: 3, targetLevel: 8, priority: "high" },
      { name: "Feature Engineering", currentLevel: 2, targetLevel: 8, priority: "high" },
      { name: "Model Deployment & MLOps", currentLevel: 1, targetLevel: 7, priority: "medium" },
      { name: "A/B Testing & Experimentation", currentLevel: 2, targetLevel: 7, priority: "medium" },
      { name: "Natural Language Processing", currentLevel: 1, targetLevel: 7, priority: "medium" },
      { name: "Computer Vision", currentLevel: 1, targetLevel: 6, priority: "low" },
      { name: "Business Intelligence", currentLevel: 2, targetLevel: 7, priority: "medium" },
      { name: "Data Ethics & Privacy", currentLevel: 2, targetLevel: 7, priority: "medium" },
      { name: "Communication & Storytelling", currentLevel: 3, targetLevel: 8, priority: "high" },
    ],
  }

  return (
    skillMaps[targetRole] || [
      { name: "Core Domain Knowledge", currentLevel: 3, targetLevel: 9, priority: "high" },
      { name: "Advanced Technical Skills", currentLevel: 2, targetLevel: 8, priority: "high" },
      { name: "Industry Tools Mastery", currentLevel: 2, targetLevel: 8, priority: "high" },
      { name: "System Architecture", currentLevel: 1, targetLevel: 7, priority: "high" },
      { name: "Leadership & Communication", currentLevel: 3, targetLevel: 8, priority: "medium" },
      { name: "Emerging Technologies", currentLevel: 1, targetLevel: 7, priority: "medium" },
    ]
  )
}

export async function POST(request: NextRequest) {
  try {
    const body: RoadmapRequest = await request.json()

    if (!body.targetRole) {
      return Response.json({ success: false, message: "Target role is required" }, { status: 400 })
    }

    console.log("[v0] Generating AI-powered roadmap for:", body.targetRole)

    const roadmap = await generateRoadmapContent(body)

    console.log("[v0] Generated AI roadmap with", roadmap.milestones.length, "milestones")

    return Response.json({
      success: true,
      message: "AI-powered roadmap generated successfully",
      ...roadmap,
    })
  } catch (error) {
    console.error("AI roadmap generation error:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to generate AI roadmap",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
