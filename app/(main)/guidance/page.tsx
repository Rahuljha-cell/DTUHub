"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Star,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { BRANCHES } from "@/types";
import { createOrGetChat } from "@/lib/chat";
import toast from "react-hot-toast";

export default function GuidancePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [filterBranch, setFilterBranch] = useState("");
  const [searchExpertise, setSearchExpertise] = useState("");
  const [form, setForm] = useState({
    expertise: "",
    branch: "",
    year: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterBranch) params.set("branch", filterBranch);
      if (searchExpertise) params.set("expertise", searchExpertise);
      const res = await fetch(`/api/guidance?${params.toString()}`);
      const data = await res.json();
      setProfiles(data);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [filterBranch, searchExpertise]);

  useEffect(() => {
    fetchProfiles();
  }, [filterBranch, searchExpertise, fetchProfiles]);

  const handleRegister = async () => {
    if (!form.expertise || !form.branch || !form.year) {
      toast.error("Fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertise: form.expertise.split(",").map((s) => s.trim()),
          branch: form.branch,
          year: parseInt(form.year),
          description: form.description,
        }),
      });

      if (res.ok) {
        toast.success("Mentor profile created!");
        setShowRegister(false);
        fetchProfiles();
      } else {
        const err = await res.json();
        toast.error(err.error);
      }
    } catch {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConnect = async (mentorId: string, mentorName: string) => {
    const userId = (session?.user as any)?.id;
    const userName = session?.user?.name || "User";

    if (!userId) return;

    try {
      await createOrGetChat(userId, userName, mentorId, mentorName);
      toast.success("Chat created! Redirecting...");
      router.push("/chat");
    } catch {
      toast.error("Failed to create chat");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Find a Mentor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Get guidance from seniors on academics, placements, and more.
          </p>
        </div>
        <Button onClick={() => setShowRegister(true)}>
          <Plus className="h-4 w-4" /> Become a Mentor
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by expertise (e.g., Data Structures, Placement)..."
            value={searchExpertise}
            onChange={(e) => setSearchExpertise(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Branches</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Profiles grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="py-16 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No mentors found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Be the first to register as a mentor and help juniors!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile: any) => (
            <Card key={profile._id}>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar
                    src={profile.user?.avatar}
                    name={profile.user?.name || "Mentor"}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {profile.user?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {profile.branch} • Year {profile.year}
                    </p>
                    {profile.rating > 0 && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        {profile.rating.toFixed(1)} ({profile.reviewCount})
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {profile.expertise?.map((exp: string) => (
                    <Badge key={exp} variant="info">
                      {exp}
                    </Badge>
                  ))}
                </div>
                {profile.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                    {profile.description}
                  </p>
                )}
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() =>
                    handleConnect(profile.user?._id, profile.user?.name)
                  }
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Register Modal */}
      <Modal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        title="Register as Mentor"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Share your knowledge and help juniors navigate their time at DTU.
          </p>
          <Input
            label="Areas of Expertise (comma separated)"
            placeholder="e.g., Data Structures, Placements, Web Dev"
            value={form.expertise}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, expertise: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Branch"
              options={BRANCHES.map((b) => ({ value: b, label: b }))}
              placeholder="Select branch"
              value={form.branch}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, branch: e.target.value }))
              }
            />
            <Select
              label="Year"
              options={Array.from({ length: 5 }, (_, i) => ({
                value: String(i + 1),
                label: `Year ${i + 1}`,
              }))}
              placeholder="Year"
              value={form.year}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, year: e.target.value }))
              }
            />
          </div>
          <Textarea
            label="About you"
            placeholder="Tell juniors about your experience and how you can help..."
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowRegister(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              loading={submitting}
              className="flex-1"
            >
              Register
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
