"use client"

import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function AdminAnalyticsPage() {
  const { user } = useAuth()

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6">
          <p className="text-foreground">Admin access required.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Platform Analytics</h2>
        <p className="text-muted-foreground mt-1">System-wide metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-3xl font-bold text-foreground mt-2">1,234</p>
          <p className="text-xs text-accent mt-3">+89 this week</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-3xl font-bold text-foreground mt-2">892</p>
          <p className="text-xs text-accent mt-3">72.3% of total</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Courses</p>
          <p className="text-3xl font-bold text-foreground mt-2">456</p>
          <p className="text-xs text-accent mt-3">+23 this month</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg Completion</p>
          <p className="text-3xl font-bold text-foreground mt-2">68%</p>
          <p className="text-xs text-accent mt-3">+4% from last month</p>
        </Card>
      </div>

      {/* User Growth */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">User Growth (Last 30 Days)</h3>
        <div className="flex gap-2 items-end h-40 mb-4">
          {[45, 52, 48, 61, 58, 72, 68, 82, 75, 88, 92, 105, 98, 112, 118].map((value, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-lg hover:opacity-80 transition-opacity"
              style={{ height: `${(value / 120) * 100}%` }}
              title={`Day ${idx + 1}: ${value} users`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">User registrations over time</p>
      </Card>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">User Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Students</span>
                <span className="text-foreground font-bold">892 (72.3%)</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "72.3%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Instructors</span>
                <span className="text-foreground font-bold">156 (12.6%)</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: "12.6%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Admins</span>
                <span className="text-foreground font-bold">12 (0.97%)</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: "0.97%" }} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Course Categories</h3>
          <div className="space-y-4">
            {[
              { name: "Frontend", courses: 145, pct: 32 },
              { name: "Backend", courses: 134, pct: 29 },
              { name: "AI & ML", courses: 98, pct: 21 },
              { name: "Data Science", courses: 79, pct: 17 },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground font-medium">{cat.name}</span>
                  <span className="text-foreground font-bold">{cat.courses}</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Platform Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-muted-foreground">System Uptime</p>
            <p className="text-2xl font-bold text-accent mt-2">99.8%</p>
          </div>
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
            <p className="text-2xl font-bold text-primary mt-2">245ms</p>
          </div>
          <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Active Sessions</p>
            <p className="text-2xl font-bold text-secondary mt-2">523</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
