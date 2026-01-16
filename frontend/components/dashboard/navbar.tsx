"use client"

import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const { user } = useAuth()

  return (
    <div className="h-16 bg-card border-b border-border fixed right-0 left-0 md:left-64 top-0 flex items-center justify-between px-4 md:px-6 animate-in fade-in duration-300">
      <div className="hidden md:block">
        <h1 className="text-lg md:text-xl font-semibold text-foreground text-pretty">Welcome back, {user?.name}!</h1>
      </div>
      <div className="md:hidden">
        <h1 className="text-sm font-semibold text-foreground">EduHub</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors hover:scale-110 transform"
          title="Notifications"
        >
          🔔
        </button>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transition-shadow">
          {user?.name?.[0]}
        </div>
      </div>
    </div>
  )
}
