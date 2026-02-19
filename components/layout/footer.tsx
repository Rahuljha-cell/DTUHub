import { GraduationCap, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gray-50 dark:border-white/5 dark:bg-gray-950">
      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 text-white shadow-glow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                DTU<span className="gradient-text">Hub</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              The student community platform for Delhi Technological University.
              Rent, share, learn, and connect.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
              Platform
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/browse", label: "Browse Rentals" },
                { href: "/resources", label: "Study Resources" },
                { href: "/guidance", label: "Get Guidance" },
                { href: "/community", label: "Community" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/listings/new", label: "List an Item" },
                { href: "/resources/upload", label: "Share Resources" },
                { href: "/chat", label: "Messages" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
              About
            </h4>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Built by DTU students, for DTU students. We are just a connector
              &mdash; all transactions happen directly between peers.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200/50 pt-6 dark:border-gray-800/50">
          <p className="flex items-center justify-center gap-1.5 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} DTUHub. Made with
            <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" />
            at Delhi Technological University.
          </p>
        </div>
      </div>
    </footer>
  );
}
