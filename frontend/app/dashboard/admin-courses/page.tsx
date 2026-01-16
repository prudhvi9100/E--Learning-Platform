"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

const COURSES_DATA = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Sarah Chen",
    status: "Published",
    students: 145,
    rating: 4.9,
  },
  { id: 2, title: "Node.js REST APIs", instructor: "Alex Rodriguez", status: "Published", students: 89, rating: 4.7 },
  { id: 3, title: "TypeScript Mastery", instructor: "Lisa Wang", status: "Pending Review", students: 0, rating: 0 },
  {
    id: 4,
    title: "Python for Data Science",
    instructor: "James Miller",
    status: "Flagged",
    students: 234,
    rating: 4.2,
  },
  { id: 5, title: "Docker Basics", instructor: "Emma Johnson", status: "Published", students: 156, rating: 4.6 },
]

export default function AdminCoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState(COURSES_DATA)

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6">
          <p className="text-foreground">Admin access required.</p>
        </Card>
      </div>
    )
  }

  const handleApproveCourse = (id: number) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, status: "Published" } : c)))
  }

  const handleRemoveCourse = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id))
  }

  const pendingCount = courses.filter((c) => c.status === "Pending Review").length
  const flaggedCount = courses.filter((c) => c.status === "Flagged").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Course Management</h2>
        <p className="text-muted-foreground mt-1">Review, approve, and manage all courses</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-3xl font-bold text-accent mt-2">{pendingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Flagged Content</p>
          <p className="text-3xl font-bold text-destructive mt-2">{flaggedCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Published Courses</p>
          <p className="text-3xl font-bold text-primary mt-2">
            {courses.filter((c) => c.status === "Published").length}
          </p>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Course Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Instructor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Students</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Rating</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{course.title}</td>
                  <td className="py-3 px-4 text-foreground text-sm">{course.instructor}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === "Published"
                          ? "bg-accent/20 text-accent"
                          : course.status === "Pending Review"
                            ? "bg-primary/20 text-primary"
                            : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground text-sm font-medium">{course.students}</td>
                  <td className="py-3 px-4 text-foreground text-sm">{course.rating ? `⭐ ${course.rating}` : "N/A"}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {course.status === "Pending Review" && (
                        <button
                          onClick={() => handleApproveCourse(course.id)}
                          className="text-xs px-2 py-1 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="text-xs px-2 py-1 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
