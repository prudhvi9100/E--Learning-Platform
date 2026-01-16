import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Register - EduHub",
  description: "Create a new EduHub account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-muted to-background">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <div className="mb-8 text-center animate-in slide-in-from-top">
          <h1 className="text-4xl font-bold text-primary mb-2">EduHub</h1>
          <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
          <p className="text-muted-foreground mt-2">Join our learning community today</p>
        </div>
        <div className="bg-card rounded-xl shadow-lg border border-border p-8 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
