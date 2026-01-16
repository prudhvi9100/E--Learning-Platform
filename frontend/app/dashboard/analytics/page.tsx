"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function InstructorAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/analytics/instructor', {
          credentials: 'include'
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to fetch analytics: ${res.status} ${errText}`);
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        console.error(err);
        setError("Could not load analytics data");
      } finally {
        setLoading(false);
      }
    }

    if (user && user.role === 'instructor') {
      fetchAnalytics();
    } else if (!authLoading && user && user.role !== 'instructor') {
      // Redirect or show access denied handled by render
      setLoading(false);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) return <div className="p-10 text-center">Loading analytics...</div>
  if (!user || user.role !== "instructor") return <div className="p-10 text-center text-destructive">Access denied. Instructor only.</div>
  if (error) return <div className="p-10 text-center text-destructive">{error}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Student Analytics</h2>
        <p className="text-muted-foreground mt-1">Detailed insights into student performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Students</p>
          <p className="text-3xl font-bold text-foreground mt-2">{data?.totalStudents || 0}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {data?.avgScore || 0}%
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg Completion</p>
          <p className="text-3xl font-bold text-foreground mt-2">{data?.avgCompletion || 0}%</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Hours</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {data?.totalHours || 0}
          </p>
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Course Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Course</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Students</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Avg Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Completion</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Avg Time (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {data?.coursePerformance && data.coursePerformance.length > 0 ? (
                data.coursePerformance.map((row: any, idx: number) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">{row.course}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{row.students}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 rounded-full text-sm bg-accent/20 text-accent font-medium">
                        {row.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${row.completion}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{row.timeSpent}h</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">No course data available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
