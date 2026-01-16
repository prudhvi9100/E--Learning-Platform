"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Backend URL
const API_URL = "http://localhost:5000/api"

export type UserRole = "student" | "instructor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  skillLevel?: "Beginner" | "Intermediate" | "Advanced"
  interests?: string[]
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile - Cookie is sent automatically by browser
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profiles/me`, {
        // IMPORTANT: This tells browser to send the HTTP-Only cookie
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await res.json()

      const userData: User = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: "👨‍💼",
        ...(data.profile && {
          skillLevel: data.profile.skillLevel,
          interests: data.profile.interests,
        }),
      }

      setUser(userData)
    } catch (error) {
      // Silent fail means just not logged in
      setUser(null)
    }
  }

  // Check login status on mount
  useEffect(() => {
    const initAuth = async () => {
      await fetchProfile()
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Receives the cookie from backend
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Login failed")
      }

      // Login successful, cookie is set. Now fetch profile details.
      await fetchProfile()

    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: any) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || "student"
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Registration failed")
      }

      // Registration successful, cookie is set.
      // Create Student profile immediately
      if (data.role === 'student') {
        try {
          await fetch(`${API_URL}/profiles/student`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
              skillLevel: data.skillLevel,
              interests: data.interests,
              learningPreferences: { preferredStyle: 'visual', weeklyGoalHours: 5 }
            })
          });
        } catch (profileError) {
          console.error("Failed to create initial profile:", profileError);
        }
      }

      await fetchProfile()

    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      })
    } catch (err) {
      console.error("Logout failed", err)
    }
    setUser(null)
    // No need to clear token from localStorage as we don't use it
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
