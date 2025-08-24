// Job board API configurations
const JOB_APIS = {
  adzuna: {
    baseUrl: "https://api.adzuna.com/v1/api/jobs",
    apiKey: process.env.ADZUNA_API_KEY,
    appId: process.env.ADZUNA_APP_ID,
  },
  arbeitnow: {
    baseUrl: "https://www.arbeitnow.com/api/job-board-api",
    apiKey: process.env.ARBEITNOW_API_KEY,
  },
  careerjet: {
    baseUrl: "https://public-api.careerjet.com/search",
    apiKey: process.env.CAREERJET_API_KEY,
  },
}

interface JobIngestionRequest {
  sources?: string[]
  keywords?: string[]
  locations?: string[]
  limit?: number
}

// Normalize job data from different sources
function normalizeJobData(job: any, source: string) {
  const normalized = {
    externalId: job.id || job.jobId || job.job_id,
    source,
    title: job.title || job.job_title,
    company: job.company || job.company_name || job.employer,
    description: job.description || job.job_description || job.summary,
    location: job.location || job.job_location || job.city,
    salaryMin: extractSalaryMin(job),
    salaryMax: extractSalaryMax(job),
    employmentType: normalizeEmploymentType(job.employment_type || job.job_type || job.type),
    remoteAllowed: checkRemoteAllowed(job),
    postedDate: normalizeDate(job.posted_date || job.date_posted || job.created_at),
    applicationUrl: job.application_url || job.url || job.job_url,
    requiredSkills: extractSkills(job.description || job.job_description || ""),
    preferredSkills: [],
    experienceLevel: extractExperienceLevel(job.title, job.description),
  }

  return normalized
}

// Extract minimum salary from various formats
function extractSalaryMin(job: any): number | null {
  const salaryFields = [job.salary_min, job.min_salary, job.salary_from, job.salary]

  for (const field of salaryFields) {
    if (field && typeof field === "number") return field
    if (field && typeof field === "string") {
      const match = field.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/)
      if (match) return Number.parseInt(match[1].replace(/,/g, ""))
    }
  }

  // Extract from description
  if (job.description) {
    const salaryMatch = job.description.match(/\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*-\s*\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)/)
    if (salaryMatch) {
      let min = Number.parseInt(salaryMatch[1].replace(/,/g, ""))
      if (salaryMatch[1].includes("k") || salaryMatch[1].includes("K")) {
        min *= 1000
      }
      return min
    }
  }

  return null
}

// Extract maximum salary
function extractSalaryMax(job: any): number | null {
  const salaryFields = [job.salary_max, job.max_salary, job.salary_to]

  for (const field of salaryFields) {
    if (field && typeof field === "number") return field
    if (field && typeof field === "string") {
      const match = field.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/)
      if (match) return Number.parseInt(match[1].replace(/,/g, ""))
    }
  }

  // Extract from description
  if (job.description) {
    const salaryMatch = job.description.match(/\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*-\s*\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)/)
    if (salaryMatch) {
      let max = Number.parseInt(salaryMatch[2].replace(/,/g, ""))
      if (salaryMatch[2].includes("k") || salaryMatch[2].includes("K")) {
        max *= 1000
      }
      return max
    }
  }

  return null
}

// Normalize employment type
function normalizeEmploymentType(type: string): string {
  if (!type) return "full-time"

  const typeLower = type.toLowerCase()
  if (typeLower.includes("part")) return "part-time"
  if (typeLower.includes("contract") || typeLower.includes("freelance")) return "contract"
  if (typeLower.includes("intern")) return "internship"
  if (typeLower.includes("temporary") || typeLower.includes("temp")) return "temporary"

  return "full-time"
}

// Check if remote work is allowed
function checkRemoteAllowed(job: any): boolean {
  const remoteKeywords = ["remote", "work from home", "wfh", "distributed", "anywhere"]
  const searchText = `${job.title || ""} ${job.description || ""} ${job.location || ""}`.toLowerCase()

  return remoteKeywords.some((keyword) => searchText.includes(keyword))
}

// Normalize date format
function normalizeDate(date: string | Date): string {
  if (!date) return new Date().toISOString().split("T")[0]

  try {
    return new Date(date).toISOString().split("T")[0]
  } catch {
    return new Date().toISOString().split("T")[0]
  }
}

// Extract skills from job description
function extractSkills(description: string): string[] {
  const commonSkills = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "TypeScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Linux",
    "Agile",
    "Scrum",
    "REST",
    "GraphQL",
    "HTML",
    "CSS",
    "Vue.js",
    "Angular",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "Redis",
    "Elasticsearch",
    "Jenkins",
    "Terraform",
    "Go",
    "Rust",
    "C++",
    "C#",
    ".NET",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Flutter",
    "React Native",
  ]

  const descriptionLower = description.toLowerCase()
  return commonSkills.filter((skill) => descriptionLower.includes(skill.toLowerCase()))
}

// Extract experience level from title and description
function extractExperienceLevel(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()

  if (text.includes("senior") || text.includes("lead") || text.includes("principal")) return "senior"
  if (text.includes("junior") || text.includes("entry") || text.includes("graduate")) return "entry"
  if (text.includes("mid") || text.includes("intermediate")) return "mid"
  if (text.includes("director") || text.includes("vp") || text.includes("executive")) return "executive"

  return "mid" // Default to mid-level
}

// Fetch jobs from Adzuna API
async function fetchAdzunaJobs(keywords: string[], locations: string[], limit: number) {
  const { baseUrl, apiKey, appId } = JOB_APIS.adzuna

  if (!apiKey || !appId) {
    console.warn("Adzuna API credentials not configured")
    return []
  }

  try {
    const jobs = []
    for (const location of locations.slice(0, 2)) {
      // Limit locations to avoid rate limits
      const params = new URLSearchParams({
        app_id: appId,
        app_key: apiKey,
        results_per_page: Math.min(limit, 50).toString(),
        what: keywords.join(" OR "),
        where: location,
        content_type: "application/json",
      })

      const response = await fetch(`${baseUrl}/us/search/1?${params}`)
      if (response.ok) {
        const data = await response.json()
        const normalizedJobs = data.results?.map((job: any) => normalizeJobData(job, "adzuna")) || []
        jobs.push(...normalizedJobs)
      }
    }

    return jobs.slice(0, limit)
  } catch (error) {
    console.error("Adzuna API error:", error)
    return []
  }
}

// Fetch jobs from ArbeitNow API
async function fetchArbeitNowJobs(keywords: string[], limit: number) {
  try {
    const params = new URLSearchParams({
      search: keywords.join(" "),
      limit: Math.min(limit, 100).toString(),
    })

    const response = await fetch(`${JOB_APIS.arbeitnow.baseUrl}?${params}`)
    if (response.ok) {
      const data = await response.json()
      const normalizedJobs = data.data?.map((job: any) => normalizeJobData(job, "arbeitnow")) || []
      return normalizedJobs.slice(0, limit)
    }

    return []
  } catch (error) {
    console.error("ArbeitNow API error:", error)
    return []
  }
}

// Fetch jobs from Careerjet API
async function fetchCareerjetJobs(keywords: string[], locations: string[], limit: number) {
  const { baseUrl, apiKey } = JOB_APIS.careerjet

  if (!apiKey) {
    console.warn("Careerjet API credentials not configured")
    return []
  }

  try {
    const jobs = []
    for (const location of locations.slice(0, 2)) {
      const params = new URLSearchParams({
        affid: apiKey,
        keywords: keywords.join(" "),
        location: location,
        pagesize: Math.min(limit, 99).toString(),
        locale_code: "en_US",
        sort: "relevance",
      })

      const response = await fetch(`${baseUrl}?${params}`)
      if (response.ok) {
        const data = await response.json()
        const normalizedJobs = data.jobs?.map((job: any) => normalizeJobData(job, "careerjet")) || []
        jobs.push(...normalizedJobs)
      }
    }

    return jobs.slice(0, limit)
  } catch (error) {
    console.error("Careerjet API error:", error)
    return []
  }
}

// Generate embeddings for job descriptions
async function generateJobEmbeddings(jobs: any[]) {
  // This would integrate with your embedding service (OpenAI, Cohere, etc.)
  // For now, return jobs with placeholder embeddings
  return jobs.map((job) => ({
    ...job,
    embedding: new Array(1536).fill(0).map(() => Math.random()), // Placeholder 1536-dim embedding
  }))
}

// Main POST handler for job ingestion
export async function POST(request: Request) {
  try {
    const body: JobIngestionRequest = await request.json()
    const {
      sources = ["adzuna", "arbeitnow", "careerjet"],
      keywords = ["software engineer", "developer", "programmer"],
      locations = ["New York", "San Francisco", "Remote"],
      limit = 50,
    } = body

    console.log("[v0] Starting job ingestion with params:", { sources, keywords, locations, limit })

    const allJobs = []

    // Fetch from each requested source
    if (sources.includes("adzuna")) {
      const adzunaJobs = await fetchAdzunaJobs(keywords, locations, Math.floor(limit / sources.length))
      allJobs.push(...adzunaJobs)
      console.log("[v0] Fetched", adzunaJobs.length, "jobs from Adzuna")
    }

    if (sources.includes("arbeitnow")) {
      const arbeitNowJobs = await fetchArbeitNowJobs(keywords, Math.floor(limit / sources.length))
      allJobs.push(...arbeitNowJobs)
      console.log("[v0] Fetched", arbeitNowJobs.length, "jobs from ArbeitNow")
    }

    if (sources.includes("careerjet")) {
      const careerjetJobs = await fetchCareerjetJobs(keywords, locations, Math.floor(limit / sources.length))
      allJobs.push(...careerjetJobs)
      console.log("[v0] Fetched", careerjetJobs.length, "jobs from Careerjet")
    }

    // Remove duplicates based on title and company
    const uniqueJobs = allJobs.filter(
      (job, index, self) => index === self.findIndex((j) => j.title === job.title && j.company === job.company),
    )

    // Generate embeddings for semantic matching
    const jobsWithEmbeddings = await generateJobEmbeddings(uniqueJobs)

    console.log("[v0] Processed", jobsWithEmbeddings.length, "unique jobs with embeddings")

    // In a real implementation, you would save these to your database here
    // await saveJobsToDatabase(jobsWithEmbeddings)

    return Response.json({
      success: true,
      message: `Successfully ingested ${jobsWithEmbeddings.length} jobs`,
      data: {
        totalJobs: jobsWithEmbeddings.length,
        sources: sources,
        jobs: jobsWithEmbeddings.slice(0, 10), // Return first 10 for preview
      },
    })
  } catch (error) {
    console.error("Job ingestion error:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to ingest jobs",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
