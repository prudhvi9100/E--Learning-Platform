"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Frontend",
    level: "Beginner",
    price: "",
    totalDuration: ""
  })
  const [modules, setModules] = useState<Array<{ id: number; name: string; lessons: number }>>([])
  const [newModule, setNewModule] = useState("")

  const handleAddModule = () => {
    if (newModule.trim()) {
      setModules([...modules, { id: Date.now(), name: newModule, lessons: 0 }])
      setNewModule("")
    }
  }

  const handleRemoveModule = (id: number) => {
    setModules(modules.filter((m) => m.id !== id))
  }

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('totalDuration', formData.totalDuration);

      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        // Content-Type header must be undefined for FormData to work automatically
        credentials: 'include',
        body: formDataToSend
      })

      if (res.ok) {
        // Success
        router.push('/dashboard')
      } else {
        const error = await res.json()
        alert(error.message || "Failed to create course")
      }
    } catch (error) {
      console.error("Error creating course:", error)
      alert("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Create New Course</h2>
        <p className="text-muted-foreground mt-1">Build and share your knowledge with students</p>
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Course Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Course Availability</label>
            <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors relative">
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setThumbnailFile(e.target.files[0])
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center py-4">
                {thumbnailFile ? (
                  <>
                    <p className="text-green-500 font-medium">✅ {thumbnailFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">📷 Upload Course Thumbnail</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Course Title</label>
            <Input
              placeholder="Enter course title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              placeholder="What will students learn?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              >
                <option>Frontend</option>
                <option>Backend</option>
                <option>AI</option>
                <option>Data Science</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Price (₹)</label>
              <Input
                type="number"
                placeholder="Ex: 499"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Duration (e.g. 10h 30m)</label>
              <Input
                placeholder="Ex: 10h 30m"
                value={formData.totalDuration}
                onChange={(e) => setFormData({ ...formData, totalDuration: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Modules */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Course Modules</h3>
        <div className="space-y-4">
          {modules.length > 0 && (
            <div className="space-y-2">
              {modules.map((module, idx) => (
                <div key={module.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Module {idx + 1}: {module.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{module.lessons} lessons</p>
                  </div>
                  <button
                    onClick={() => handleRemoveModule(module.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Module name (e.g., Introduction)"
              value={newModule}
              onChange={(e) => setNewModule(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
            />
            <Button onClick={handleAddModule}>Add Module</Button>
          </div>
        </div>
      </Card>

      {/* Publishing */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Publish Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <input type="checkbox" id="visibility" defaultChecked className="w-5 h-5" />
            <label htmlFor="visibility" className="text-foreground font-medium">
              Make course visible to students
            </label>
          </div>
          <div className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <input type="checkbox" id="certificate" defaultChecked className="w-5 h-5" />
            <label htmlFor="certificate" className="text-foreground font-medium">
              Award certificate on completion
            </label>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish Course"}
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Save as Draft
        </Button>
      </div>
    </div>
  )
}
