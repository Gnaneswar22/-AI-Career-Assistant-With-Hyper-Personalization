import { type NextRequest, NextResponse } from "next/server"

interface UserProfile {
  skills: string[]
  experience: Array<{
    title: string
    company: string
    skills: string[]
  }>
  preferences: {
    targetRole: string
    locations: string[]
    salaryMin?: number
    remotePreference: boolean
    experienceLevel: string
  }
}

interface JobRecommendationRequest {
  userId: string
  userProfile: UserProfile
  limit?: number
  filters?: {
    location?: string
    salaryMin?: number
    experienceLevel?: string
    remoteOnly?: boolean
  }
}

// Mock job data - in production, this would come from your database
const MOCK_JOBS = [
  {
    id: "job_1",
    title: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    salaryMin: 180000,
    salaryMax: 250000,
    employmentType: "full-time",
    remoteAllowed: true,
    postedDate: "2024-01-15",
    description:
      "Join our team to build scalable systems that serve billions of users. Work with cutting-edge technologies and collaborate with world-class engineers on products that impact millions of people worldwide.",
    requiredSkills: ["JavaScript", "React", "Node.js", "Python", "AWS", "System Design"],
    preferredSkills: ["TypeScript", "Docker", "Kubernetes", "GraphQL", "Microservices"],
    experienceLevel: "senior",
    applicationUrl: "https://careers.google.com/jobs/123",
    source: "adzuna",
    companySize: "large",
    industry: "Technology",
  },
  {
    id: "job_2",
    title: "Full Stack Developer",
    company: "Microsoft",
    location: "Seattle, WA",
    salaryMin: 160000,
    salaryMax: 220000,
    employmentType: "full-time",
    remoteAllowed: true,
    postedDate: "2024-01-14",
    description:
      "Build innovative solutions using modern web technologies. Contribute to products used by millions of users worldwide. Work in an agile environment with cross-functional teams.",
    requiredSkills: ["JavaScript", "React", "C#", ".NET", "Azure", "SQL"],
    preferredSkills: ["TypeScript", "SQL Server", "DevOps", "Angular"],
    experienceLevel: "mid",
    applicationUrl: "https://careers.microsoft.com/jobs/456",
    source: "arbeitnow",
    companySize: "large",
    industry: "Technology",
  },
  {
    id: "job_3",
    title: "Frontend Engineer",
    company: "Meta",
    location: "Menlo Park, CA",
    salaryMin: 170000,
    salaryMax: 240000,
    employmentType: "full-time",
    remoteAllowed: false,
    postedDate: "2024-01-13",
    description:
      "Create exceptional user experiences for billions of people. Work on cutting-edge frontend technologies and frameworks. Collaborate with designers and product managers.",
    requiredSkills: ["JavaScript", "React", "TypeScript", "CSS", "HTML"],
    preferredSkills: ["GraphQL", "React Native", "Jest", "Webpack"],
    experienceLevel: "senior",
    applicationUrl: "https://careers.meta.com/jobs/789",
    source: "careerjet",
    companySize: "large",
    industry: "Social Media",
  },
  {
    id: "job_4",
    title: "Backend Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    salaryMin: 175000,
    salaryMax: 230000,
    employmentType: "full-time",
    remoteAllowed: true,
    postedDate: "2024-01-12",
    description:
      "Build and scale payment infrastructure that powers millions of businesses. Work with distributed systems, APIs, and financial technology.",
    requiredSkills: ["Python", "Go", "PostgreSQL", "Redis", "AWS"],
    preferredSkills: ["Kubernetes", "Terraform", "gRPC", "Kafka"],
    experienceLevel: "senior",
    applicationUrl: "https://stripe.com/jobs/456",
    source: "adzuna",
    companySize: "medium",
    industry: "Fintech",
  },
  {
    id: "job_5",
    title: "Data Engineer",
    company: "Airbnb",
    location: "San Francisco, CA",
    salaryMin: 165000,
    salaryMax: 215000,
    employmentType: "full-time",
    remoteAllowed: true,
    postedDate: "2024-01-11",
    description:
      "Build data pipelines and infrastructure to support data-driven decision making. Work with large-scale data processing and analytics systems.",
    requiredSkills: ["Python", "SQL", "Spark", "Kafka", "AWS"],
    preferredSkills: ["Airflow", "Snowflake", "dbt", "Kubernetes"],
    experienceLevel: "mid",
    applicationUrl: "https://careers.airbnb.com/jobs/789",
    source: "arbeitnow",
    companySize: "large",
    industry: "Travel",
  },
]

// Skill similarity scoring
function calculateSkillMatch(userSkills: string[], jobSkills: string[]): number {
  const userSkillsLower = userSkills.map((s) => s.toLowerCase())
  const jobSkillsLower = jobSkills.map((s) => s.toLowerCase())

  const matchedSkills = jobSkillsLower.filter((skill) => userSkillsLower.includes(skill))
  return jobSkillsLower.length > 0 ? (matchedSkills.length / jobSkillsLower.length) * 100 : 0
}

// Experience level matching
function calculateExperienceMatch(userLevel: string, jobLevel: string): number {
  const levels = { entry: 1, mid: 2, senior: 3, executive: 4 }
  const userLevelNum = levels[userLevel as keyof typeof levels] || 2
  const jobLevelNum = levels[jobLevel as keyof typeof levels] || 2

  const diff = Math.abs(userLevelNum - jobLevelNum)
  return Math.max(0, 100 - diff * 25) // 25% penalty per level difference
}

// Location preference scoring
function calculateLocationMatch(userLocations: string[], jobLocation: string, remoteAllowed: boolean): number {
  if (remoteAllowed) return 100 // Perfect match if remote is allowed

  const jobLocationLower = jobLocation.toLowerCase()
  const hasLocationMatch = userLocations.some((loc) => jobLocationLower.includes(loc.toLowerCase()))

  return hasLocationMatch ? 100 : 50 // 50% if location doesn't match but not remote
}

// Salary matching
function calculateSalaryMatch(userMinSalary: number | undefined, jobMinSalary: number | undefined): number {
  if (!userMinSalary || !jobMinSalary) return 75 // Neutral score if no salary info

  if (jobMinSalary >= userMinSalary) return 100
  const diff = (userMinSalary - jobMinSalary) / userMinSalary
  return Math.max(0, 100 - diff * 100) // Linear penalty for salary gap
}

// Generate match reasons
function generateMatchReasons(
  skillMatch: number,
  experienceMatch: number,
  locationMatch: number,
  salaryMatch: number,
  job: any,
  userProfile: UserProfile,
): string[] {
  const reasons: string[] = []

  if (skillMatch >= 70) {
    reasons.push("Strong skill alignment with your background")
  }
  if (experienceMatch >= 90) {
    reasons.push("Perfect experience level match")
  }
  if (locationMatch >= 90) {
    if (job.remoteAllowed) {
      reasons.push("Remote work available")
    } else {
      reasons.push("Location matches your preferences")
    }
  }
  if (salaryMatch >= 90) {
    reasons.push("Salary meets your expectations")
  }
  if (job.companySize === "large") {
    reasons.push("Large company with growth opportunities")
  }

  return reasons.slice(0, 3) // Limit to top 3 reasons
}

// Find missing skills
function findMissingSkills(userSkills: string[], jobSkills: string[]): string[] {
  const userSkillsLower = userSkills.map((s) => s.toLowerCase())
  return jobSkills.filter((skill) => !userSkillsLower.includes(skill.toLowerCase()))
}

// Main recommendation algorithm
function calculateJobMatch(job: any, userProfile: UserProfile) {
  const allUserSkills = [...userProfile.skills, ...userProfile.experience.flatMap((exp) => exp.skills)]

  // Calculate individual match scores
  const skillMatch = calculateSkillMatch(allUserSkills, [...job.requiredSkills, ...job.preferredSkills])
  const experienceMatch = calculateExperienceMatch(userProfile.preferences.experienceLevel, job.experienceLevel)
  const locationMatch = calculateLocationMatch(
    userProfile.preferences.locations,
    job.location,
    job.remoteAllowed && userProfile.preferences.remotePreference,
  )
  const salaryMatch = calculateSalaryMatch(userProfile.preferences.salaryMin, job.salaryMin)

  // Weighted overall score
  const weights = {
    skills: 0.4,
    experience: 0.25,
    location: 0.2,
    salary: 0.15,
  }

  const overallScore = Math.round(
    skillMatch * weights.skills +
      experienceMatch * weights.experience +
      locationMatch * weights.location +
      salaryMatch * weights.salary,
  )

  return {
    matchScore: overallScore,
    matchReasons: generateMatchReasons(skillMatch, experienceMatch, locationMatch, salaryMatch, job, userProfile),
    missingSkills: findMissingSkills(allUserSkills, job.requiredSkills),
    breakdown: {
      skillMatch: Math.round(skillMatch),
      experienceMatch: Math.round(experienceMatch),
      locationMatch: Math.round(locationMatch),
      salaryMatch: Math.round(salaryMatch),
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userProfile, limit = 20, filters }: JobRecommendationRequest = await request.json()

    if (!userId || !userProfile) {
      return NextResponse.json({ success: false, error: "User ID and profile are required" }, { status: 400 })
    }

    // Filter jobs based on user filters
    let filteredJobs = MOCK_JOBS

    if (filters?.location) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }

    if (filters?.salaryMin) {
      filteredJobs = filteredJobs.filter((job) => (job.salaryMin || 0) >= filters.salaryMin!)
    }

    if (filters?.experienceLevel) {
      filteredJobs = filteredJobs.filter((job) => job.experienceLevel === filters.experienceLevel)
    }

    if (filters?.remoteOnly) {
      filteredJobs = filteredJobs.filter((job) => job.remoteAllowed)
    }

    // Calculate match scores for all jobs
    const jobsWithScores = filteredJobs.map((job) => {
      const matchData = calculateJobMatch(job, userProfile)
      return {
        ...job,
        ...matchData,
      }
    })

    // Sort by match score and limit results
    const recommendedJobs = jobsWithScores.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit)

    // Generate summary statistics
    const stats = {
      totalJobs: filteredJobs.length,
      recommendedJobs: recommendedJobs.length,
      averageMatchScore: Math.round(
        recommendedJobs.reduce((sum, job) => sum + job.matchScore, 0) / recommendedJobs.length,
      ),
      excellentMatches: recommendedJobs.filter((job) => job.matchScore >= 90).length,
      goodMatches: recommendedJobs.filter((job) => job.matchScore >= 80 && job.matchScore < 90).length,
      fairMatches: recommendedJobs.filter((job) => job.matchScore >= 70 && job.matchScore < 80).length,
    }

    return NextResponse.json({
      success: true,
      data: {
        jobs: recommendedJobs,
        stats,
        filters: filters || {},
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Job recommendation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate job recommendations" }, { status: 500 })
  }
}
