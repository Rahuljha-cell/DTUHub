"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  BookOpen,
  Home,
  MessageCircle,
  Package,
  Users,
  GraduationCap,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/browse", label: "Rent", icon: Package },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/guidance", label: "Guidance", icon: GraduationCap },
  { href: "/community", label: "Community", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-white/70 backdrop-blur-2xl dark:border-white/5 dark:bg-gray-900/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 text-white shadow-glow-sm transition-all duration-300 group-hover:shadow-glow group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">
            DTU<span className="gradient-text">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {session && (
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group/link relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-primary-50/80 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-primary-950/30 dark:hover:text-primary-300"
              >
                <link.icon className="h-4 w-4 transition-transform duration-300 group-hover/link:scale-110" />
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition-all duration-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
              >
                <div className="rounded-lg ring-2 ring-primary-200/50 dark:ring-primary-700/50">
                  <Avatar
                    src={session.user?.image}
                    name={session.user?.name || "User"}
                    size="sm"
                  />
                </div>
                <span className="hidden text-sm font-semibold text-gray-700 dark:text-gray-300 md:block">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className={cn(
                  "hidden h-4 w-4 text-gray-400 transition-transform duration-300 md:block",
                  dropdownOpen && "rotate-180"
                )} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-52 animate-in rounded-2xl border border-white/20 bg-white/90 p-2 shadow-glass-lg backdrop-blur-2xl dark:border-white/10 dark:bg-gray-800/90">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-primary-950/30"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      href="/listings/my"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-primary-950/30"
                    >
                      <Package className="h-4 w-4" /> My Listings
                    </Link>
                    <Link
                      href="/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-primary-950/30"
                    >
                      <Home className="h-4 w-4" /> My Bookings
                    </Link>
                    <hr className="my-1.5 border-gray-200/50 dark:border-gray-700/50" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-3d inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-glow-sm hover:shadow-glow"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-gray-600 transition-all hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-gray-800/80 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && session && (
        <div className="animate-in border-t border-white/10 bg-white/80 px-4 py-3 backdrop-blur-2xl dark:border-white/5 dark:bg-gray-900/80 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-primary-50/80 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-primary-950/30 dark:hover:text-primary-300"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
