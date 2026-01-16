"use client"

import * as React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { Analytics } from "@vercel/analytics/next"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
      <Analytics />
    </>
  )
}
