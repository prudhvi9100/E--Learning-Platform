"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Course {
    _id: string
    title: string
    description: string
    category: string
    level: string
    price: number
    thumbnail: string
    instructorId: {
        name: string
    }
}

import { Sidebar } from "@/components/dashboard/sidebar"
import { Navbar } from "@/components/dashboard/navbar"
import { ArrowLeft } from "lucide-react" // Assuming lucide-react is available or use text

export default function CoursesPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [courses, setCourses] = useState<Course[]>([])
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState<string | null>(null)

    // Filter States
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    const categories = ["All", "Frontend", "Backend", "Fullstack", "Design", "Data Science", "Mobile"]

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/courses')
                if (res.ok) {
                    const data = await res.json()
                    setCourses(data)
                    setFilteredCourses(data)
                }
            } catch (error) {
                console.error("Failed to fetch courses", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [])

    // Filter Logic
    useEffect(() => {
        let result = courses

        // 1. Filter by Search
        if (searchTerm) {
            result = result.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // 2. Filter by Category
        if (selectedCategory !== "All") {
            result = result.filter(course =>
                course.category.toLowerCase() === selectedCategory.toLowerCase()
            )
        }

        setFilteredCourses(result)
    }, [searchTerm, selectedCategory, courses])

    const handleEnroll = async (courseId: string) => {
        if (!user) {
            router.push('/login')
            return
        }

        setEnrolling(courseId)
        try {
            const res = await fetch(`http://localhost:5000/api/enrollments/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.ok) {
                router.push('/dashboard/courses')
            } else {
                const error = await res.json()
                alert(error.message || "Failed to enroll")
            }
        } catch (error) {
            console.error("Enrollment error:", error)
            alert("Something went wrong")
        } finally {
            setEnrolling(null)
        }
    }

    // Consistent with Dashboard Layout
    return (
        <div className="flex bg-background min-h-screen">
            {/* Sidebar - Only show if user is logged in, otherwise simple layout or empty */}
            {user && <Sidebar />}

            <div className={`flex-1 ${user ? 'md:ml-64' : ''}`}>
                {user && <Navbar />}

                <main className={`p-8 w-full max-w-7xl mx-auto space-y-8 ${user ? 'mt-16' : ''}`}>
                    {/* Back and Header */}
                    <div className="space-y-6">
                        <Button
                            variant="ghost"
                            className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
                            onClick={() => router.back()}
                        >
                            <span>←</span> Back
                        </Button>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground">Explore Courses</h2>
                                <p className="text-muted-foreground mt-1">Discover new skills and advance your career</p>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                                />
                                <span className="absolute right-3 top-2.5 text-muted-foreground">🔍</span>
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                        ${selectedCategory === cat
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-foreground">Loading courses...</div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
                            <Button
                                variant="link"
                                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                                className="mt-2"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <Card key={course._id} className="p-6 hover:shadow-lg transition-shadow bg-card border-border flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-foreground line-clamp-1">{course.title}</h3>
                                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    📚 {course.category}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    📊 {course.level}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Price</p>
                                                <p className="text-xl font-bold text-accent">
                                                    {course.price === 0 ? "Free" : `₹${course.price}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                                        {course.description}
                                    </p>

                                    <div className="flex gap-3 mt-auto">
                                        {user?.role === 'instructor' ? (
                                            <Button variant="outline" className="w-full bg-transparent" disabled>
                                                Instructor View
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                                onClick={() => handleEnroll(course._id)}
                                                disabled={enrolling === course._id}
                                            >
                                                {enrolling === course._id ? "Enrolling..." : "Enroll Now"}
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
