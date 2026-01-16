"use client"

import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

const ANALYTICS_DATA = [
  {
    course: "Advanced React Patterns",
    students: 145,
    avgScore: 87,
    completion: 72,
    timeSpent: 3.2,
  },
  {
    course: "Node.js REST APIs",
    students: 89,
    avgScore: 84,
    completion: 68,
    timeSpent: 2.8,
  },
  {
    course: "TypeScript Mastery",
    students: 56,
    avgScore: 89,
    completion: 85,
    timeSpent: 3.5,
  },
]

export default function InstructorAnalyticsPage() {
  const { user } = useAuth()

  if (user?.role !== "instructor") {
    return <div>Access denied</div>
  }

  const totalStudents = ANALYTICS_DATA.reduce((acc, d) => acc + d.students, 0)
  const avgCompletion =
    Math.round(ANALYTICS_DATA.reduce((acc, d) => acc + d.completion, 0) / ANALYTICS_DATA.length) || 0

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
          <p className="text-3xl font-bold text-foreground mt-2">{totalStudents}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {Math.round(ANALYTICS_DATA.reduce((acc, d) => acc + d.avgScore, 0) / ANALYTICS_DATA.length)}%
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg Completion</p>
          <p className="text-3xl font-bold text-foreground mt-2">{avgCompletion}%</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Hours</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {(ANALYTICS_DATA.reduce((acc, d) => acc + d.timeSpent * d.students, 0) / 100).toFixed(0)}
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
              {ANALYTICS_DATA.map((row, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
