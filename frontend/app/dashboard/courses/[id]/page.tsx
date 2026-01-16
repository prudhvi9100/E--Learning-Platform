"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"

interface Lesson {
  _id: string
  title: string
  type: "video" | "document" | "quiz"
  content: string
  duration: string
  isFree: boolean
}

interface Module {
  _id: string
  title: string
  lessons: Lesson[]
}

interface Course {
  _id: string
  title: string
  description: string
  instructorId: {
    _id: string
    name: string
    email: string
  }
  modules: Module[]

  // Computed on frontend for now
  totalLessons?: number
  completedLessons?: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  // Progress State
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [markingComplete, setMarkingComplete] = useState(false)

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        setLoading(true)
        // 1. Fetch Course Details
        const courseRes = await fetch(`http://localhost:5000/api/courses/${courseId}`, { credentials: "include" })

        if (courseRes.ok) {
          const courseData = await courseRes.json()
          setCourse(courseData)

          if (courseData.modules?.[0]?.lessons?.[0]) {
            setActiveLesson(courseData.modules[0].lessons[0])
          }

          // 2. Fetch User's Persistent Progress
          if (user?.role === 'student') {
            // Check enrollment first (optional, but good for validity)
            // Fetch completed lesson IDs
            const progressRes = await fetch(`http://localhost:5000/api/enrollments/${courseId}/progress`, { credentials: "include" })
            if (progressRes.ok) {
              const { completedLessonIds } = await progressRes.json()
              setCompletedLessonIds(completedLessonIds || [])
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId && user) fetchCourseAndProgress()
  }, [courseId, user])

  const handleMarkComplete = async () => {
    if (!activeLesson) return
    setMarkingComplete(true)
    try {
      const res = await fetch('http://localhost:5000/api/enrollments/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonId: activeLesson._id,
          completed: true,
          timeSpent: 0 // Mock
        }),
        credentials: 'include'
      })

      if (res.ok) {
        setCompletedLessonIds(prev => [...prev, activeLesson._id])
      }
    } catch (error) {
      console.error("Failed to mark complete", error)
    } finally {
      setMarkingComplete(false)
    }
  }

  const getFileUrl = (path: string) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `http://localhost:5000${path}`
  }

  if (loading) return <div className="p-8">Loading course content...</div>
  if (!course) return <div className="p-8">Course not found.</div>

  const isInstructor = user?.role === 'instructor' && user._id === course.instructorId._id
  const isStudent = user?.role === 'student'
  const isLessonCompleted = activeLesson && completedLessonIds.includes(activeLesson._id)

  return (
    <div className="space-y-6">
      {/* Header / Video Player Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <Card className="overflow-hidden bg-black aspect-video flex items-center justify-center relative rounded-xl shadow-lg">
            {activeLesson ? (
              activeLesson.type === 'video' ? (
                <video
                  key={activeLesson._id} // Force re-render on lesson change
                  src={getFileUrl(activeLesson.content)}
                  controls
                  className="w-full h-full object-contain"
                  autoPlay={false}
                />
              ) : (
                <div className="text-center p-8">
                  <p className="text-white text-xl mb-4">📄 Document Lesson</p>
                  <a
                    href={getFileUrl(activeLesson.content)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="secondary">Download / View Document</Button>
                  </a>
                </div>
              )
            ) : (
              <div className="text-white/50">Select a lesson to start learning</div>
            )}
          </Card>

          <div className="bg-card p-6 rounded-xl border flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{activeLesson ? activeLesson.title : course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            {isStudent && activeLesson && (
              <Button
                variant={isLessonCompleted ? "outline" : "default"}
                className={isLessonCompleted ? "border-green-500 text-green-500 hover:text-green-600" : ""}
                onClick={handleMarkComplete}
                disabled={isLessonCompleted || markingComplete}
              >
                {isLessonCompleted ? "✅ Completed" : markingComplete ? "Updating..." : "Mark as Complete"}
              </Button>
            )}
          </div>
        </div>

        {/* Syllabus / Lesson List */}
        <div className="space-y-4">
          <Card className="p-4 h-[600px] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Course Content</h3>
            {course.modules?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No lessons added yet.</p>
            ) : (
              course.modules.map((module, mIdx) => (
                <div key={module._id || mIdx} className="mb-6 last:mb-0">
                  <h4 className="font-medium text-sm text-foreground/80 mb-2 uppercase tracking-wide">
                    {module.title || `Module ${mIdx + 1}`}
                  </h4>
                  <div className="space-y-2">
                    {module.lessons?.map((lesson, lIdx) => (
                      <button
                        key={lesson._id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors text-sm
                                            ${activeLesson?._id === lesson._id
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-foreground"
                          }
                                        `}
                      >
                        <span className="text-lg">
                          {lesson.type === 'video' ? '🎥' : lesson.type === 'quiz' ? '✅' : '📄'}
                        </span>
                        <span className="line-clamp-1 flex-1">{lesson.title}</span>
                        {completedLessonIds.includes(lesson._id) && (
                          <span className="text-green-500 text-xs font-bold">✓</span>
                        )}
                        <span className="text-xs text-muted-foreground">{lesson.duration || "5m"}</span>
                      </button>
                    ))}
                    {module.lessons?.length === 0 && (
                      <p className="text-xs text-muted-foreground pl-2 italic">Module empty</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
