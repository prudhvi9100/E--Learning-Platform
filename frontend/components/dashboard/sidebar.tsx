"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

interface NavItem {
  label: string
  href: string
  icon: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const getNavItems = (): NavItem[] => {
    if (!user) return []

    const baseItems = [{ label: "Dashboard", href: "/dashboard", icon: "📊" }]

    if (user.role === "student") {
      return [
        ...baseItems,
        { label: "My Courses", href: "/dashboard/courses", icon: "📚" },
        { label: "Recommendations", href: "/dashboard/recommendations", icon: "⭐" },
        { label: "Progress", href: "/dashboard/progress", icon: "📈" },
        { label: "Profile", href: "/dashboard/profile", icon: "👤" },
      ]
    }

    if (user.role === "instructor") {
      return [
        ...baseItems,
        { label: "My Courses", href: "/dashboard/courses", icon: "📚" },
        { label: "Create Course", href: "/dashboard/create-course", icon: "➕" },
        { label: "Analytics", href: "/dashboard/analytics", icon: "📈" },
      ]
    }

    if (user.role === "admin") {
      return [
        ...baseItems,
        { label: "Users", href: "/dashboard/users", icon: "👥" },
        { label: "Courses", href: "/dashboard/admin-courses", icon: "📚" },
        { label: "Analytics", href: "/dashboard/admin-analytics", icon: "📊" },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:hidden fixed top-4 left-4 z-40 p-2 hover:bg-muted rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 flex flex-col overflow-y-auto transform transition-transform duration-300 md:translate-x-0 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-white font-bold animate-in fade-in">
              E
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">EduHub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md scale-105"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-sidebar-border space-y-3 animate-in fade-in">
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-accent-foreground capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm bg-sidebar-accent text-sidebar-accent-foreground rounded-lg hover:bg-sidebar-accent/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          aria-label="Close sidebar"
        />
      )}
    </>
  )
}
