"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        console.log("[v0] User logged in, redirecting to dashboard:", user)
        router.push("/dashboard")
      } else {
        console.log("[v0] No user, redirecting to login")
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  return null
}
