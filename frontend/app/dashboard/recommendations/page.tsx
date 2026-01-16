"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function RecommendationsPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 1. Fetch all courses
        const coursesRes = await fetch('http://localhost:5000/api/courses')
        const allCourses = await coursesRes.json()

        // 2. Fetch my enrollments
        const enrollRes = await fetch('http://localhost:5000/api/enrollments/my-courses', { credentials: 'include' })
        const myEnrollments = await enrollRes.json()
        const enrolledCourseIds = myEnrollments.map((e: any) => e.courseId._id || e.courseId) // Handle populated vs unpopulated

        // 3. Filter: Show courses I am NOT enrolled in
        const recommended = allCourses.filter((c: any) => !enrolledCourseIds.includes(c._id))

        setCourses(recommended)
      } catch (error) {
        console.error("Failed to fetch recommendations", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId)
    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/${courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      if (res.ok) {
        router.push(`/dashboard/courses/${courseId}`)
      } else {
        alert("Enrollment failed")
      }
    } catch (error) {
      console.error("Enrollment error", error)
    } finally {
      setEnrolling(null)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/300?text=No+Image";
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  }

  if (loading) return <div className="p-8">Finding best courses for you...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Recommended for You</h2>
        <p className="text-muted-foreground mt-1">Based on what you haven't learned yet</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-lg text-muted-foreground">You are enrolled in all available courses! 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/50">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(course.thumbnail)}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full border border-white/10">
                    {course.category || "General"}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border
                        ${course.level === 'Beginner' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                        course.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                          'bg-purple-500/10 text-purple-600 border-purple-500/20'}`}>
                      {course.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                    {course.description || "No description available."}
                  </p>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Price</span>
                    <span className="font-bold text-lg">
                      {course.price === 0 || course.price === "0" ? "Free" : `₹${course.price}`}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrolling === course._id}
                    className="rounded-full px-6"
                  >
                    {enrolling === course._id ? "..." : "Enroll Now"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
