"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/analytics/student', {
          credentials: 'include' // Use cookies
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch analytics: ${res.status} ${errorText}`);
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        console.error(err);
        setError("Could not load progress data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalytics();
    } else if (!authLoading) {
      // Not logged in or loading finished without user
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading) return <div className="text-center p-10">Loading analytics...</div>;
  if (error) return <div className="text-center p-10 text-destructive">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Learning Analytics</h2>
        <p className="text-muted-foreground mt-1">Your progress, insights, and weak areas</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Study Hours</p>
          <p className="text-3xl font-bold text-foreground">{data?.totalStudyHours || 0}</p>
          <p className="text-xs text-accent mt-2">Keep it up!</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Quiz Average</p>
          <p className="text-3xl font-bold text-foreground">{data?.quizAverage || 0}%</p>
          <p className="text-xs text-accent mt-2">Overall performance</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Learning Streak</p>
          <p className="text-3xl font-bold text-foreground">{data?.streak || 0}</p>
          <p className="text-xs text-accent mt-2">days active recently</p>
        </Card>
      </div>

      {/* Course Performance */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Course-wise Performance</h3>
        <div className="space-y-4">
          {data?.coursePerformance && data.coursePerformance.length > 0 ? (
            data.coursePerformance.map((item: any, idx: number) => (
              <div key={idx} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-foreground">{item.course}</p>
                  <span className="text-sm font-semibold text-accent">{item.score}%</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No course performance data available yet.</p>
          )}
        </div>
      </Card>

      {/* Weak Areas */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Topics to Focus On</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data?.weakAreas && data.weakAreas.length > 0 ? (
            data.weakAreas.map((topic: string, idx: number) => (
              <div key={idx} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-foreground">{topic}</p>
                <p className="text-xs text-destructive mt-1">Review recommended</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Great job! No specific weak areas detected.</p>
          )}
        </div>
      </Card>

      {/* Weekly Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Weekly Activity</h3>
        <div className="flex gap-2 items-end h-32">
          {data?.weeklyActivity && data.weeklyActivity.map((value: number, idx: number) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${Math.min((value / 60) * 120, 120)}px` }} // Scaling based on 60 mins max visual
              />
              <p className="text-xs text-muted-foreground">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
