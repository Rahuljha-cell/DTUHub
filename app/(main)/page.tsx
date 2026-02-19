import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  MessageCircle,
  Package,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Rent & Lend",
    description:
      "Rent books, electronics, sports gear and more from fellow students. List your own items and earn.",
    href: "/browse",
    gradient: "from-blue-500 to-cyan-400",
    bgGlow: "bg-blue-500/10",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
    shadowColor: "shadow-neon-blue",
  },
  {
    icon: BookOpen,
    title: "Study Resources",
    description:
      "Access notes, PYQs, assignments, and e-books shared by seniors and classmates.",
    href: "/resources",
    gradient: "from-emerald-500 to-teal-400",
    bgGlow: "bg-emerald-500/10",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-400",
    shadowColor: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  },
  {
    icon: GraduationCap,
    title: "Mentorship",
    description:
      "Get guidance from seniors on academics, placements, projects, and campus life.",
    href: "/guidance",
    gradient: "from-purple-500 to-violet-400",
    bgGlow: "bg-purple-500/10",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-400",
    shadowColor: "shadow-neon-purple",
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description:
      "Connect instantly with other students. Coordinate rentals, ask questions, or just chat.",
    href: "/chat",
    gradient: "from-orange-500 to-amber-400",
    bgGlow: "bg-orange-500/10",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-400",
    shadowColor: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Share updates, events, opportunities, and connect with the DTU student body.",
    href: "/community",
    gradient: "from-pink-500 to-rose-400",
    bgGlow: "bg-pink-500/10",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-400",
    shadowColor: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
  },
  {
    icon: Sparkles,
    title: "Smart Discovery",
    description:
      "AI-powered recommendations to find the right items, resources, and mentors for you.",
    href: "/browse",
    gradient: "from-indigo-500 to-blue-400",
    bgGlow: "bg-indigo-500/10",
    iconBg: "bg-gradient-to-br from-indigo-500 to-blue-400",
    shadowColor: "shadow-glow-sm",
  },
];

const stats = [
  { label: "DTU Students", value: "15,000+", icon: Users },
  { label: "Items Listed", value: "500+", icon: Package },
  { label: "Resources Shared", value: "2,000+", icon: BookOpen },
  { label: "Active Mentors", value: "100+", icon: Star },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-gray-900 to-primary-900" />

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 gradient-mesh-dark opacity-60" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Floating 3D orbs */}
        <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-primary-500/20 blur-3xl animate-blob" />
        <div className="absolute top-40 right-[15%] h-96 w-96 rounded-full bg-purple-500/15 blur-3xl animate-blob animation-delay-2000" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 left-[30%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-40 right-[10%] h-64 w-64 rounded-full bg-pink-500/10 blur-3xl animate-float-slow" />

        {/* Floating 3D shapes */}
        <div className="absolute top-32 right-[20%] animate-float hidden lg:block">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-400/30 to-purple-400/30 backdrop-blur-sm border border-white/10 rotate-12 shadow-glass" />
        </div>
        <div className="absolute bottom-32 left-[15%] animate-float-reverse hidden lg:block">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-400/30 backdrop-blur-sm border border-white/10 -rotate-12 shadow-glass" />
        </div>
        <div className="absolute top-1/2 right-[8%] animate-float-delay hidden xl:block">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-400/30 to-pink-400/30 backdrop-blur-sm border border-white/10 rotate-45 shadow-glass" />
        </div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-primary-500/20 to-transparent" />
        <div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary-500/10 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Pill badge */}
            <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-xl">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary-400 to-purple-400">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-primary-200">
                Built by DTU students, for DTU students
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-primary-300" />
            </div>

            {/* Main heading */}
            <h1 className="animate-slide-up-delay mb-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Your Campus,{" "}
              <span className="relative">
                <span className="gradient-text">Your Community</span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-60 blur-sm" />
              </span>
            </h1>

            <p className="animate-slide-up-delay-2 mb-12 text-lg leading-relaxed text-gray-300 sm:text-xl md:text-2xl md:leading-relaxed">
              Rent books & gear, share study materials, find mentors, and
              connect with 15,000+ DTU students &mdash; all in one{" "}
              <span className="font-semibold text-white">beautiful platform</span>.
            </p>

            {/* CTA Buttons */}
            <div className="animate-slide-up-delay-2 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/register"
                className="btn-3d group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 px-8 py-4 text-base font-semibold text-white shadow-glow transition-all hover:shadow-glow-lg sm:text-lg"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/browse"
                className="btn-3d inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/30 sm:text-lg"
              >
                <Package className="h-5 w-5" />
                Browse Rentals
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-16 flex items-center justify-center gap-3 animate-slide-up-delay-2">
              <div className="flex -space-x-2">
                {[
                  "bg-gradient-to-br from-blue-400 to-blue-600",
                  "bg-gradient-to-br from-green-400 to-green-600",
                  "bg-gradient-to-br from-purple-400 to-purple-600",
                  "bg-gradient-to-br from-orange-400 to-orange-600",
                  "bg-gradient-to-br from-pink-400 to-pink-600",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`h-9 w-9 rounded-full ${bg} border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {["R", "A", "P", "S", "M"][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Loved by <span className="font-semibold text-gray-300">2,000+</span> DTU students
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-950" />
      </section>

      {/* Stats - Floating 3D cards */}
      <section className="relative -mt-20 z-10 pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="card-3d glass-card-strong p-5 text-center sm:p-6"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 text-white shadow-glow-sm">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold gradient-text sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - 3D Cards Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark opacity-50" />

        <div className="relative">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
              <Sparkles className="h-3.5 w-3.5" />
              Everything you need
            </div>
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              One platform for{" "}
              <span className="gradient-text">campus life</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
              From renting textbooks to finding a mentor for your next project
              &mdash; DTUHub has it all.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="card-3d group glass-card overflow-hidden p-1"
              >
                <div className="rounded-xl bg-white/50 p-6 dark:bg-gray-800/50 h-full">
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 ${feature.bgGlow} opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl blur-xl`} />

                  <div className="relative">
                    <div
                      className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} text-white feature-icon-3d`}
                    >
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-all group-hover:gap-3 dark:text-primary-400">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - 3D Steps */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-primary-50/30 to-gray-50 dark:from-gray-950 dark:via-primary-950/20 dark:to-gray-950" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
              <Zap className="h-3.5 w-3.5" />
              Simple process
            </div>
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              How renting{" "}
              <span className="gradient-text">works</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Three simple steps. Peer-to-peer. No middlemen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "List your item",
                desc: "Upload photos, set your price, and choose payment options — Cash on Delivery, 50% advance, or full payment.",
                gradient: "from-blue-500 to-cyan-400",
              },
              {
                step: "02",
                title: "Connect & agree",
                desc: "Borrowers browse and request items. Chat directly to agree on meetup time and place on campus.",
                gradient: "from-purple-500 to-pink-400",
              },
              {
                step: "03",
                title: "Meet & exchange",
                desc: "Meet on campus, exchange the item, and handle payment directly. Leave a review when done!",
                gradient: "from-orange-500 to-amber-400",
              },
            ].map((item, i) => (
              <div key={item.step} className="card-3d group glass-card-strong p-8 text-center">
                {/* Step number */}
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-2xl font-extrabold text-white shadow-lg`}>
                  {item.step}
                </div>

                {/* Connector line (hidden on last) */}
                {i < 2 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-8 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 md:block" style={{ transform: "translateX(100%)" }} />
                )}

                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Glass cards */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "DTU Students Only",
              desc: "Verified student community. Only DTU students can join and transact.",
              gradient: "from-blue-500 to-indigo-500",
            },
            {
              icon: Heart,
              title: "Peer-to-Peer",
              desc: "No middlemen, no hidden fees. Direct student-to-student connections.",
              gradient: "from-pink-500 to-rose-500",
            },
            {
              icon: Zap,
              title: "100% Free Platform",
              desc: "No platform fees. List, browse, and connect completely free.",
              gradient: "from-amber-500 to-orange-500",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="card-3d glass-card group flex gap-5 p-6"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA - 3D Gradient Section */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />

          {/* Floating orbs */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          {/* Floating shapes */}
          <div className="absolute top-8 right-12 h-16 w-16 rounded-xl bg-white/10 rotate-12 animate-float backdrop-blur-sm hidden lg:block" />
          <div className="absolute bottom-8 left-12 h-12 w-12 rounded-lg bg-white/10 -rotate-12 animate-float-reverse backdrop-blur-sm hidden lg:block" />

          <div className="relative px-8 py-20 text-center sm:px-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" />
              Join today
            </div>
            <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Ready to join the community?
            </h2>
            <p className="mb-10 text-lg text-white/80">
              Sign up in seconds and start renting, sharing, and connecting.
            </p>
            <Link
              href="/register"
              className="btn-3d inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary-700 shadow-xl transition-all hover:shadow-2xl sm:text-lg"
            >
              Join DTUHub Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
