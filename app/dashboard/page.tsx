"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BrainCircuit,
  FileText,
  Target,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Bell,
  Settings,
  ArrowRight,
  Plus,
  Star,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                AI Career Assistant
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Welcome back, John! 👋
              </h2>
              <p className="text-muted-foreground text-lg">Here's your career progress and today's recommendations</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Quick Actions
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">92%</div>
                <div className="text-sm text-muted-foreground">ATS Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">47</div>
                <div className="text-sm text-muted-foreground">Job Matches</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">67%</div>
                <div className="text-sm text-muted-foreground">Roadmap</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">12</div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Recommendations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Job Recs
                  </CardTitle>
                  <Badge variant="secondary">3 New</Badge>
                </div>
                <CardDescription>Fresh opportunities matching your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">Senior Software Engineer</h4>
                      <p className="text-muted-foreground">Google • San Francisco, CA</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary">96% Match</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        React
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        TypeScript
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Node.js
                      </Badge>
                    </div>
                    <Button size="sm">Apply Now</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">Full Stack Developer</h4>
                      <p className="text-muted-foreground">Microsoft • Seattle, WA</p>
                    </div>
                    <Badge className="bg-accent/10 text-accent">94% Match</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        JavaScript
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Python
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        AWS
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  View All Job Recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Skill Proficiency
                </CardTitle>
                <CardDescription>Your current skill levels and progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Skills */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Technical Skills
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>React</span>
                          <span className="font-semibold">90%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>TypeScript</span>
                          <span className="font-semibold">85%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Node.js</span>
                          <span className="font-semibold">80%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Python</span>
                          <span className="font-semibold">75%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Soft Skills</h4>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Leadership</span>
                          <span className="font-semibold">70%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Communication</span>
                          <span className="font-semibold">88%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "88%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Problem Solving</span>
                          <span className="font-semibold">92%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Team Collaboration</span>
                          <span className="font-semibold">85%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Take Skill Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Career Development
                </CardTitle>
                <CardDescription>Your progress towards career goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-semibold">67% Complete</span>
                  </div>
                  <Progress value={67} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Completed Courses</h4>
                    </div>
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">This quarter</p>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <h4 className="font-semibold">Skills Improved</h4>
                    </div>
                    <p className="text-2xl font-bold text-accent">8</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  View Learning Roadmap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resume Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ATS Optimization</span>
                    <Badge className="bg-primary/20 text-primary">92%</Badge>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span className="text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Versions</span>
                    <span className="font-semibold">3 Active</span>
                  </div>
                </div>

                <Button size="sm" className="w-full">
                  Update Resume
                </Button>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-accent/5 rounded-lg">
                  <div className="p-1 bg-accent/20 rounded">
                    <Star className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profile Completion</p>
                    <p className="text-xs text-muted-foreground">Earned today</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-lg">
                  <div className="p-1 bg-primary/20 rounded">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">React Mastery</p>
                    <p className="text-xs text-muted-foreground">Earned 3 days ago</p>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  View All Certificates
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  Practice Interview
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Coaching
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Chat with AI Coach
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
