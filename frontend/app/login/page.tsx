import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - EduHub",
  description: "Sign in to your EduHub account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-primary/80 text-white p-12 flex-col justify-between animate-in fade-in duration-500">
        <div className="animate-in slide-in-from-left">
          <h1 className="text-4xl font-bold mb-2">EduHub</h1>
          <p className="text-primary-foreground/90 text-lg">Adaptive E-Learning Platform</p>
        </div>
        <div className="space-y-4">
          {[
            {
              icon: "📚",
              title: "Learn",
              desc: "Explore courses tailored to your goals",
            },
            {
              icon: "🎓",
              title: "Teach",
              desc: "Create and share your expertise",
            },
            {
              icon: "📊",
              title: "Analyze",
              desc: "Track progress and insights",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 animate-in slide-in-from-left"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl hover:bg-white/20 transition-colors">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-primary-foreground/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-muted lg:bg-background">
        <div className="w-full max-w-md animate-in fade-in duration-500">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">EduHub</h1>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to continue to EduHub</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
