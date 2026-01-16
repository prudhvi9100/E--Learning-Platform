"use client"

import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"

// Define interfaces for data
interface Course {
  _id: string
  title: string
  level: string
  category: string
  price: number
  thumbnail: string
  totalDuration: string
  instructorId: {
    name: string
    email: string
  }
}

interface Enrollment {
  _id: string
  courseId: Course
  progressPercentage: number
  status: 'Active' | 'Completed'
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  if (user?.role === "student") {
    return <StudentDashboard />
  } else if (user?.role === "instructor") {
    return <InstructorDashboard />
  } else if (user?.role === "admin") {
    return <AdminDashboard />
  }

  return null
}

function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/enrollments/my-courses', {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          setEnrollments(data)
        }
      } catch (error) {
        console.error("Failed to fetch enrollments", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  // Calculate stats
  const totalEnrolled = enrollments.length
  const completed = enrollments.filter(e => e.status === 'Completed').length
  const avgProgress = totalEnrolled > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progressPercentage, 0) / totalEnrolled)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Learning Dashboard</h2>
        <p className="text-muted-foreground mt-1">Track your progress and continue learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Courses Enrolled</p>
              <p className="text-3xl font-bold text-foreground mt-2">{totalEnrolled}</p>
            </div>
            <span className="text-3xl">📚</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-foreground mt-2">{completed}</p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgProgress}%</p>
            </div>
            <span className="text-3xl">🎯</span>
          </div>
        </Card>
      </div>

      {/* Recent Courses / Enrollments */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">My Courses</h3>
        {loading ? (
          <div>Loading courses...</div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
            <Link href="/courses" className="text-primary hover:underline">Browse Courses</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-foreground">{enrollment.courseId?.title || "Untitled Course"}</p>
                  <p className="text-sm text-muted-foreground">{enrollment.courseId?.category}</p>
                </div>
                <div className="text-right w-1/3 md:w-1/4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">Progress</span>
                    <span className="text-xs font-medium text-foreground">{enrollment.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${enrollment.progressPercentage}%` }} />
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

function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses/my-courses', {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          setCourses(data)
        }
      } catch (error) {
        console.error("Failed to fetch courses", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyCourses()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Teaching Dashboard</h2>
        <p className="text-muted-foreground mt-1">Manage your courses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Courses Created</p>
              <p className="text-3xl font-bold text-foreground mt-2">{courses.length}</p>
            </div>
            <span className="text-3xl">📚</span>
          </div>
        </Card>
      </div>

      {/* Created Courses */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Courses</h3>
        {loading ? (
          <div>Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't created any courses yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course._id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{course.title}</p>
                  <p className="text-sm text-muted-foreground">{course.category} • {course.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">₹{course.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Platform Analytics</h2>
        <p className="text-muted-foreground mt-1">Manage users, courses, and platform metrics</p>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        Admin dashboard implementation pending...
      </div>
    </div>
  )
}

