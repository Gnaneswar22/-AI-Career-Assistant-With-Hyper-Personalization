"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Target,
  MapPin,
  DollarSign,
  Clock,
  Building,
  ExternalLink,
  Heart,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Bookmark,
  Share2,
  RefreshCw,
} from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number
  salaryMax?: number
  employmentType: string
  remoteAllowed: boolean
  postedDate: string
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
  experienceLevel: string
  applicationUrl: string
  source: string
  matchScore: number
  missingSkills: string[]
  matchReasons: string[]
}

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    salaryMin: 180000,
    salaryMax: 250000,
    employmentType: "full-time",
    remoteAllowed: true,
    postedDate: "2024-01-15",
    description:
      "Join our team to build scalable systems that serve billions of users. Work with cutting-edge technologies and collaborate with world-class engineers.",
    requiredSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    preferredSkills: ["TypeScript", "Docker", "Kubernetes", "GraphQL"],
    experienceLevel: "senior",
    applicationUrl: "https://careers.google.com/jobs/123",
    source: "adzuna",
    matchScore: 96,
    missingSkills: ["Kubernetes"],
    matchReasons: ["Strong skill alignment", "Experience level match", "Location preference"],
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "Microsoft",
    location: "Seattle, WA",
    salaryMin: 160000,
    salaryMax: 220000,
    employmentType: "full-time",
    remoteAllowed: true,
    postedDate: "2024-01-14",
    description:
      "Build innovative solutions using modern web technologies. Contribute to products used by millions of users worldwide.",
    requiredSkills: ["JavaScript", "React", "C#", ".NET", "Azure"],
    preferredSkills: ["TypeScript", "SQL Server", "DevOps"],
    experienceLevel: "mid",
    applicationUrl: "https://careers.microsoft.com/jobs/456",
    source: "arbeitnow",
    matchScore: 94,
    missingSkills: ["C#", ".NET"],
    matchReasons: ["Technology stack match", "Company size preference", "Remote work available"],
  },
  {
    id: "3",
    title: "Frontend Engineer",
    company: "Meta",
    location: "Menlo Park, CA",
    salaryMin: 170000,
    salaryMax: 240000,
    employmentType: "full-time",
    remoteAllowed: false,
    postedDate: "2024-01-13",
    description:
      "Create exceptional user experiences for billions of people. Work on cutting-edge frontend technologies and frameworks.",
    requiredSkills: ["JavaScript", "React", "TypeScript", "CSS", "HTML"],
    preferredSkills: ["GraphQL", "React Native", "Jest"],
    experienceLevel: "senior",
    applicationUrl: "https://careers.meta.com/jobs/789",
    source: "careerjet",
    matchScore: 89,
    missingSkills: ["GraphQL", "React Native"],
    matchReasons: ["Frontend specialization", "React expertise", "Large scale systems"],
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(MOCK_JOBS)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [salaryFilter, setSalaryFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.requiredSkills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (experienceFilter) {
      filtered = filtered.filter((job) => job.experienceLevel === experienceFilter)
    }

    if (remoteOnly) {
      filtered = filtered.filter((job) => job.remoteAllowed)
    }

    if (salaryFilter) {
      const minSalary = Number.parseInt(salaryFilter)
      filtered = filtered.filter((job) => (job.salaryMin || 0) >= minSalary)
    }

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore)

    setFilteredJobs(filtered)
  }, [jobs, searchQuery, locationFilter, salaryFilter, experienceFilter, remoteOnly])

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleApplyJob = (jobId: string, applicationUrl: string) => {
    setAppliedJobs((prev) => [...prev, jobId])
    window.open(applicationUrl, "_blank")
  }

  const refreshJobs = async () => {
    setIsLoading(true)
    // Simulate API call to refresh jobs
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 80) return "text-yellow-600"
    if (score >= 70) return "text-orange-600"
    return "text-muted-foreground"
  }

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return "bg-primary/10"
    if (score >= 80) return "bg-yellow-100"
    if (score >= 70) return "bg-orange-100"
    return "bg-muted/50"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Job Recommendations
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered • Personalized • Updated Daily</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {filteredJobs.length} Matches
              </Badge>
              <Button onClick={refreshJobs} disabled={isLoading} variant="outline">
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="search">Search & Filter</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Today's Top Matches */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Today's Top Matches
                      </CardTitle>
                      <Badge variant="secondary">Updated 2 hours ago</Badge>
                    </div>
                    <CardDescription>
                      Personalized recommendations based on your profile and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {filteredJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{job.title}</h3>
                              <Badge
                                className={`${getMatchScoreBg(job.matchScore)} ${getMatchScoreColor(job.matchScore)}`}
                              >
                                {job.matchScore}% Match
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                <span>{job.company}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              {job.remoteAllowed && (
                                <Badge variant="outline" className="text-xs">
                                  Remote OK
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {job.salaryMin && job.salaryMax && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>
                                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span className="capitalize">{job.employmentType}</span>
                              </div>
                              <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveJob(job.id)}
                              className={savedJobs.includes(job.id) ? "text-primary" : ""}
                            >
                              <Heart className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Job Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                        {/* Skills */}
                        <div className="space-y-3 mb-4">
                          <div>
                            <Label className="text-xs font-semibold text-muted-foreground">REQUIRED SKILLS</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {job.requiredSkills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {job.preferredSkills.length > 0 && (
                            <div>
                              <Label className="text-xs font-semibold text-muted-foreground">PREFERRED SKILLS</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {job.preferredSkills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Match Analysis */}
                        <div className="bg-muted/30 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Why this matches you</span>
                          </div>
                          <div className="space-y-2">
                            {job.matchReasons.map((reason, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-primary" />
                                <span>{reason}</span>
                              </div>
                            ))}
                            {job.missingSkills.length > 0 && (
                              <div className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-3 w-3 text-yellow-600 mt-0.5" />
                                <span>
                                  <span className="text-yellow-600">Skills to develop:</span>{" "}
                                  {job.missingSkills.join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => handleApplyJob(job.id, job.applicationUrl)}
                            disabled={appliedJobs.includes(job.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {appliedJobs.includes(job.id) ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Applied
                              </>
                            ) : (
                              <>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Apply Now
                              </>
                            )}
                          </Button>
                          <Button variant="outline">View Details</Button>
                          <Badge variant="outline" className="text-xs">
                            via {job.source}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Match Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Match Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{filteredJobs.length}</div>
                      <div className="text-sm text-muted-foreground">Total Matches</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Excellent (90%+)</span>
                        <span className="font-semibold">
                          {filteredJobs.filter((job) => job.matchScore >= 90).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Good (80-89%)</span>
                        <span className="font-semibold">
                          {filteredJobs.filter((job) => job.matchScore >= 80 && job.matchScore < 90).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fair (70-79%)</span>
                        <span className="font-semibold">
                          {filteredJobs.filter((job) => job.matchScore >= 70 && job.matchScore < 80).length}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Remote Available</span>
                        <span className="font-semibold">{filteredJobs.filter((job) => job.remoteAllowed).length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Applied Today</span>
                        <span className="font-semibold">{appliedJobs.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-accent" />
                      Quick Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any level</SelectItem>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Salary</Label>
                      <Select value={salaryFilter} onValueChange={setSalaryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any salary" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any salary</SelectItem>
                          <SelectItem value="80000">$80,000+</SelectItem>
                          <SelectItem value="100000">$100,000+</SelectItem>
                          <SelectItem value="120000">$120,000+</SelectItem>
                          <SelectItem value="150000">$150,000+</SelectItem>
                          <SelectItem value="200000">$200,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
                      <Label htmlFor="remote" className="text-sm">
                        Remote work only
                      </Label>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setExperienceFilter("")
                        setSalaryFilter("")
                        setRemoteOnly(false)
                        setLocationFilter("")
                        setSearchQuery("")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>

                {/* Job Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">Get notified when new jobs match your profile</div>
                    <Button size="sm" className="w-full">
                      Set Up Alerts
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Search & Filter Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Advanced Search
                </CardTitle>
                <CardDescription>Find specific jobs using detailed filters and search criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Search Keywords</Label>
                    <Input
                      placeholder="Job title, company, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="City, state, or remote"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any level</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Found {filteredJobs.length} jobs matching your criteria
                  </div>
                  <Button variant="outline" size="sm">
                    Save Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge className={`${getMatchScoreBg(job.matchScore)} ${getMatchScoreColor(job.matchScore)}`}>
                            {job.matchScore}% Match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{job.company}</span>
                          <span>{job.location}</span>
                          {job.salaryMin && job.salaryMax && (
                            <span>
                              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveJob(job.id)}
                          className={savedJobs.includes(job.id) ? "text-primary" : ""}
                        >
                          <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          onClick={() => handleApplyJob(job.id, job.applicationUrl)}
                          disabled={appliedJobs.includes(job.id)}
                          size="sm"
                        >
                          {appliedJobs.includes(job.id) ? "Applied" : "Apply"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Jobs</CardTitle>
                <CardDescription>Jobs you've bookmarked for later review</CardDescription>
              </CardHeader>
              <CardContent>
                {savedJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No saved jobs yet</p>
                    <p className="text-sm text-muted-foreground">Save jobs you're interested in to review them later</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs
                      .filter((job) => savedJobs.includes(job.id))
                      .map((job) => (
                        <div key={job.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{job.title}</h3>
                              <p className="text-muted-foreground">{job.company}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleApplyJob(job.id, job.applicationUrl)}
                                disabled={appliedJobs.includes(job.id)}
                                size="sm"
                              >
                                {appliedJobs.includes(job.id) ? "Applied" : "Apply"}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleSaveJob(job.id)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applied Jobs Tab */}
          <TabsContent value="applied" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Applied Jobs</CardTitle>
                <CardDescription>Track your job applications and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {appliedJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <p className="text-sm text-muted-foreground">Start applying to jobs to track your progress here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs
                      .filter((job) => appliedJobs.includes(job.id))
                      .map((job) => (
                        <div key={job.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{job.title}</h3>
                              <p className="text-muted-foreground">{job.company}</p>
                              <Badge variant="secondary" className="mt-2">
                                Application Submitted
                              </Badge>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">Applied today</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
