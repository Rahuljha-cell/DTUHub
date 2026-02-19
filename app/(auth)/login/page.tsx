"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import toast from "react-hot-toast";
import { LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        router.push("/browse");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/browse" });
  };

  return (
    <div>
      <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
        <Sparkles className="h-3 w-3" />
        Welcome back
      </div>
      <h2 className="mb-2 text-2xl font-extrabold text-gray-900 dark:text-white">
        Sign in to <span className="gradient-text">DTUHub</span>
      </h2>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Access your campus community dashboard
      </p>

      <button
        onClick={handleGoogle}
        className="card-3d mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200/50 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-700 backdrop-blur-xl transition-all hover:bg-white hover:shadow-glass dark:border-gray-600/50 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/50 dark:border-gray-700/50" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white/80 px-4 text-xs font-medium text-gray-400 backdrop-blur-sm dark:bg-gray-800/80 dark:text-gray-500">
            or sign in with email
          </span>
        </div>
      </div>

      <form onSubmit={handleCredentials} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your.email@dtu.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold gradient-text hover:opacity-80"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
