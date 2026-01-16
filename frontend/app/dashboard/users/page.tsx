"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

const USERS_DATA = [
  { id: 1, name: "Sarah Chen", email: "sarah@example.com", role: "Student", status: "Active", joined: "2024-01-15" },
  {
    id: 2,
    name: "Alex Rodriguez",
    email: "alex@example.com",
    role: "Instructor",
    status: "Active",
    joined: "2024-01-10",
  },
  { id: 3, name: "Emma Johnson", email: "emma@example.com", role: "Student", status: "Active", joined: "2024-01-20" },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Student",
    status: "Blocked",
    joined: "2024-01-05",
  },
  { id: 5, name: "Lisa Wang", email: "lisa@example.com", role: "Instructor", status: "Active", joined: "2024-01-12" },
  { id: 6, name: "James Miller", email: "james@example.com", role: "Student", status: "Active", joined: "2024-01-18" },
]

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState(USERS_DATA)
  const [filter, setFilter] = useState("All")

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6">
          <p className="text-foreground">Admin access required.</p>
        </Card>
      </div>
    )
  }

  const filteredUsers = filter === "All" ? users : users.filter((u) => u.role === filter)

  const toggleBlockUser = (id: number) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground mt-1">Manage platform users and roles</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["All", "Student", "Instructor"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === tab ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-foreground text-sm">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === "Active" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground text-sm">{u.joined}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleBlockUser(u.id)}
                      className="text-sm px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {u.status === "Active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
