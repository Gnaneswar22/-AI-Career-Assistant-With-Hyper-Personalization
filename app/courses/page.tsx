"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Play, CheckCircle } from "lucide-react"

interface CourseSection {
  id: string
  title: string
  completed: number
  total: number
  duration: string
  lessons: Lesson[]
  expanded: boolean
}

interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  type: "video" | "reading" | "quiz"
}

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("course-content")
  const [sections, setSections] = useState<CourseSection[]>([
    {
      id: "1",
      title: "Introduction",
      completed: 0,
      total: 1,
      duration: "2min",
      expanded: true,
      lessons: [{ id: "1-1", title: "Project Introduction", duration: "2min", completed: false, type: "video" }],
    },
    {
      id: "2",
      title: "NodeJS Backend API",
      completed: 0,
      total: 19,
      duration: "4hr 25min",
      expanded: false,
      lessons: [
        { id: "2-1", title: "Setting up Node.js Environment", duration: "15min", completed: false, type: "video" },
        { id: "2-2", title: "Express.js Fundamentals", duration: "25min", completed: false, type: "video" },
        { id: "2-3", title: "Database Connection", duration: "20min", completed: false, type: "video" },
        // ... more lessons would be here
      ],
    },
    {
      id: "3",
      title: "Frontend React Client",
      completed: 0,
      total: 21,
      duration: "6hr 47min",
      expanded: false,
      lessons: [
        { id: "3-1", title: "React Setup and Configuration", duration: "18min", completed: false, type: "video" },
        { id: "3-2", title: "Component Architecture", duration: "30min", completed: false, type: "video" },
        // ... more lessons would be here
      ],
    },
    {
      id: "4",
      title: "Unit tests (API)",
      completed: 0,
      total: 3,
      duration: "23min",
      expanded: false,
      lessons: [
        { id: "4-1", title: "Testing Setup", duration: "8min", completed: false, type: "video" },
        { id: "4-2", title: "API Testing", duration: "15min", completed: false, type: "video" },
      ],
    },
    {
      id: "5",
      title: "Source Code / GitHub Repositories",
      completed: 0,
      total: 2,
      duration: "8min",
      expanded: false,
      lessons: [
        { id: "5-1", title: "GitHub Setup", duration: "4min", completed: false, type: "video" },
        { id: "5-2", title: "Code Repository", duration: "4min", completed: false, type: "reading" },
      ],
    },
    {
      id: "6",
      title: "Resources & Beyond",
      completed: 0,
      total: 6,
      duration: "2min",
      expanded: false,
      lessons: [{ id: "6-1", title: "Additional Resources", duration: "2min", completed: false, type: "reading" }],
    },
    {
      id: "7",
      title: "Extra",
      completed: 0,
      total: 1,
      duration: "27min",
      expanded: false,
      lessons: [{ id: "7-1", title: "Bonus Content", duration: "27min", completed: false, type: "video" }],
    },
  ])

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) => (section.id === sectionId ? { ...section, expanded: !section.expanded } : section)),
    )
  }

  const completeLesson = (sectionId: string, lessonId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedLessons = section.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
          )
          const completed = updatedLessons.filter((l) => l.completed).length
          return { ...section, lessons: updatedLessons, completed }
        }
        return section
      }),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="course-content">Course content</TabsTrigger>
          <TabsTrigger value="ai-assistant">✨ AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="course-content" className="space-y-0">
          <div className="border rounded-lg overflow-hidden">
            {sections.map((section, index) => (
              <div key={section.id} className={index !== sections.length - 1 ? "border-b" : ""}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-900">
                      Section {section.id}: {section.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {section.completed} / {section.total} | {section.duration}
                    </span>
                    {section.expanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {section.expanded && (
                  <div className="px-6 pb-4">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 py-3 px-4 bg-gray-100 rounded-lg mb-2 last:mb-0"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button onClick={() => completeLesson(section.id, lesson.id)} className="flex-shrink-0">
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded"></div>
                            )}
                          </button>
                          <span className="text-sm font-medium text-gray-700">
                            {lesson.id.split("-")[1]}. {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Play className="h-4 w-4" />
                          {lesson.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Learning Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">Hi! I'm your AI learning assistant. I can help you with:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Explaining complex concepts</li>
                    <li>• Providing additional examples</li>
                    <li>• Answering questions about the course material</li>
                    <li>• Suggesting practice exercises</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">Start Chat</Button>
                  <Button variant="outline">View Help Topics</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
