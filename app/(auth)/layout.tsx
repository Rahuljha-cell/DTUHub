import { GraduationCap, BookOpen, Package, Users, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - 3D animated visual */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-purple-900 to-primary-900" />

        {/* Mesh gradient */}
        <div className="absolute inset-0 gradient-mesh-dark opacity-60" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Animated orbs */}
        <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        {/* Floating 3D shapes */}
        <div className="absolute top-16 right-20 animate-float">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 rotate-12 shadow-glass">
            <BookOpen className="h-6 w-6 text-white/70" />
          </div>
        </div>
        <div className="absolute bottom-24 left-16 animate-float-reverse">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 -rotate-12 shadow-glass">
            <Package className="h-5 w-5 text-white/70" />
          </div>
        </div>
        <div className="absolute top-1/3 left-12 animate-float-delay">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 rotate-45 shadow-glass">
            <Users className="h-4 w-4 text-white/70 -rotate-45" />
          </div>
        </div>
        <div className="absolute bottom-1/3 right-12 animate-float">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 -rotate-6 shadow-glass">
            <MessageCircle className="h-5 w-5 text-white/70" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl border border-white/20 shadow-glass-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-white">
            Welcome to DTU<span className="text-primary-300">Hub</span>
          </h1>
          <p className="text-lg leading-relaxed text-primary-100/80">
            Your one-stop student community platform. Rent books, share
            resources, find mentors, and connect with fellow DTU students.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Rent & Lend", "Study Resources", "Mentorship", "Community"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-xl border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/3 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-2/3 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      {/* Right panel - Form */}
      <div className="relative flex w-full items-center justify-center px-4 lg:w-1/2">
        {/* Subtle background */}
        <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark opacity-30" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 text-white shadow-glow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">
              DTU<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Glass card wrapper for form */}
          <div className="glass-card-strong p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
