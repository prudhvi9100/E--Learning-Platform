"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

interface Course {
  _id: string
  title: string
  category: string
  level: string
  price: number
  thumbnail: string
  totalDuration: string
  students?: number
  rating?: number
  revenue?: number
  status?: string
}

interface Enrollment {
  _id: string
  courseId: Course
  progressPercentage: number
  status: 'Active' | 'Completed'
}

export default function CoursesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (user?.role === 'instructor') {
          const res = await fetch('http://localhost:5000/api/courses/my-courses', { credentials: 'include' })
          if (res.ok) setCourses(await res.json())
        } else if (user?.role === 'student') {
          const res = await fetch('http://localhost:5000/api/enrollments/my-courses', { credentials: 'include' })
          if (res.ok) setEnrollments(await res.json())
        }
      } catch (error) {
        console.error("Failed to fetch courses", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (authLoading || loading) {
    return <div className="p-8">Loading courses...</div>
  }

  if (user?.role === "instructor") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Courses</h2>
            <p className="text-muted-foreground mt-1">Manage and track your courses</p>
          </div>
          <Link href="/dashboard/create-course">
            <Button>Create New Course</Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
            <Link href="/dashboard/create-course">
              <Button variant="outline">Create Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <Card key={course._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>📚 {course.category}</span>
                      <span>📊 {course.level}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent`}
                      >
                        Published
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-2xl font-bold text-accent">₹{course.price || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="bg-transparent">
                    Edit
                  </Button>
                  <Link href={`/dashboard/courses/${course._id}/lessons`}>
                    <Button variant="outline" className="bg-transparent">
                      Upload Lessons
                    </Button>
                  </Link>
                  <Button variant="outline" className="bg-transparent">
                    Analytics
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Student view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Courses</h2>
          <p className="text-muted-foreground mt-1">Continue learning where you left off</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">You are not enrolled in any courses.</p>
          <Link href="/courses">
            <Button variant="outline">Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enrollment) => (
            <Link key={enrollment._id} href={`/dashboard/courses/${enrollment.courseId?._id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl">
                  Example Thumbnail
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground text-lg text-balance">{enrollment.courseId?.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap bg-primary/20 text-primary`}
                    >
                      {enrollment.courseId?.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{enrollment.courseId?.category}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{enrollment.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary transition-all"
                        style={{ width: `${enrollment.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <Button className="w-full mt-4">Continue Learning</Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
