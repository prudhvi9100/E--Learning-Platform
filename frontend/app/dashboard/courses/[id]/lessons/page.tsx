"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useParams } from "next/navigation"

interface Lesson {
  _id: string
  title: string
  type: "video" | "document" | "quiz"
  content: string // URL path
  duration: string
  createdAt: string
}

export default function UploadLessonsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Form State
  const [newLesson, setNewLesson] = useState({ title: "", type: "video" as const })
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch Course Lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`, { credentials: "include" })
        if (res.ok) {
          const courseData = await res.json()
          // Extract lessons from course modules
          // Backend returns populated modules -> lessons
          const allLessons: Lesson[] = []
          courseData.modules?.forEach((module: any) => {
            module.lessons?.forEach((lesson: any) => {
              allLessons.push(lesson)
            })
          })
          setLessons(allLessons)
        }
      } catch (error) {
        console.error("Failed to fetch lessons", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchLessons()
    }
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleAddLesson = async () => {
    if (!newLesson.title.trim() || !file) {
      alert("Please provide a title and select a file.")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("title", newLesson.title)
    formData.append("type", newLesson.type)
    formData.append("file", file)
    // Optional: duration could be calculated or user input, defaulting for now

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}/lessons`, {
        method: "POST",
        body: formData,
        credentials: "include", // Important for cookies
      })

      if (res.ok) {
        const createdLesson = await res.json()
        setLessons([...lessons, createdLesson])

        // Reset Form
        setNewLesson({ title: "", type: "video" })
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        alert("Lesson uploaded successfully!")
      } else {
        const error = await res.json()
        alert(error.message || "Failed to upload lesson")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Something went wrong during upload.")
    } finally {
      setUploading(false)
    }
  }

  // Helper to get full content URL
  const getFileUrl = (path: string) => {
    if (path.startsWith("http")) return path
    return `http://localhost:5000${path}`
  }

  if (user?.role !== "instructor") {
    return <div className="p-8">Unauthorized</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Upload Course Lessons</h2>
        <p className="text-muted-foreground mt-1">Manage lessons for Course ID: {id}</p>
      </div>

      {/* Upload Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add New Lesson</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Lesson Title</label>
            <input
              type="text"
              placeholder="Enter lesson title"
              value={newLesson.title}
              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              className="mt-2 w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Content Type</label>
            <select
              value={newLesson.type}
              onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value as "video" | "document" | "quiz" })}
              className="mt-2 w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            >
              <option value="video">Video</option>
              <option value="document">Document/PDF</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Upload File</label>
            <div className="mt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={newLesson.type === 'video' ? "video/*" : ".pdf,.doc,.docx"}
                className="block w-full text-sm text-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90
                    "
              />
            </div>
          </div>

          <Button onClick={handleAddLesson} className="w-full" disabled={uploading}>
            {uploading ? "Uploading (Please Wait)..." : "Upload Lesson"}
          </Button>
        </div>
      </Card>

      {/* Lessons List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Course Lessons ({lessons.length})</h3>
        {loading ? (
          <p>Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <p className="text-muted-foreground">No lessons uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div key={lesson._id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    {lesson.type === "video" && <span className="text-2xl">🎥</span>}
                    {lesson.type === "document" && <span className="text-2xl">📄</span>}
                    {lesson.type === "quiz" && <span className="text-2xl">✅</span>}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Lesson {idx + 1}: {lesson.title}
                    </p>
                    <a
                      href={getFileUrl(lesson.content)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Content
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
