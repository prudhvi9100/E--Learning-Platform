"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Info */}
      <Card className="p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.name?.[0]}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
            <p className="text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-accent mt-2 capitalize">Student • {user?.skillLevel}</p>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="font-semibold text-foreground mb-4">Learning Profile</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Skill Level</label>
              <p className="text-foreground font-medium mt-1">{user?.skillLevel}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Areas of Interest</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.interests?.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-foreground">Email notifications</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-foreground">Course recommendations</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-foreground">Learning reminders</label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full">Edit Profile</Button>
        <Button variant="outline" className="w-full bg-transparent">
          Change Password
        </Button>
        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 bg-transparent">
          Download Data
        </Button>
      </div>
    </div>
  )
}
