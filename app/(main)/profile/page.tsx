"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Package,
  BookOpen,
  Star,
  MapPin,
  Calendar,
  Save,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    phone: "",
    skills: "",
    interests: "",
  });
  const [saving, setSaving] = useState(false);

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        setUserData(data);
        setForm({
          name: data.user.name || "",
          bio: data.user.bio || "",
          phone: data.user.phone || "",
          skills: (data.user.skills || []).join(", "),
          interests: (data.user.interests || []).join(", "),
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          phone: form.phone,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          interests: form.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        toast.success("Profile updated!");
        setEditing(false);
        const updated = await res.json();
        setUserData((prev: any) => ({ ...prev, user: updated }));
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!userData) return null;
  const { user, listings, resources, stats } = userData;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex items-end gap-4">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="lg"
              className="!h-24 !w-24 !text-2xl ring-4 ring-white dark:ring-gray-800"
            />
            <div className="flex-1 pb-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {user.branch}
                    {user.year && ` • Year ${user.year}`}
                    {user.rollNumber && ` • ${user.rollNumber}`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-4 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {stats.listingCount}
              </div>
              <div className="text-xs text-gray-500">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {stats.resourceCount}
              </div>
              <div className="text-xs text-gray-500">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {stats.avgRating}
              </div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {stats.reviewCount}
              </div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div className="mt-4 space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Textarea
                label="Bio"
                placeholder="Tell others about yourself..."
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={2}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <Input
                label="Skills (comma separated)"
                placeholder="React, Node.js, Python"
                value={form.skills}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, skills: e.target.value }))
                }
              />
              <Input
                label="Interests (comma separated)"
                placeholder="Web Dev, AI, Cricket"
                value={form.interests}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, interests: e.target.value }))
                }
              />
              <Button onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          )}

          {/* Bio & skills */}
          {!editing && (
            <div className="mt-4">
              {user.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {user.bio}
                </p>
              )}
              {user.skills?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {user.skills.map((skill: string) => (
                    <Badge key={skill} variant="info">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* User's listings */}
      {listings?.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              <Package className="mr-2 inline h-5 w-5" /> Listings
            </h2>
            <Link
              href="/listings/my"
              className="text-sm text-primary-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing: any) => (
              <Link key={listing._id} href={`/listings/${listing._id}`}>
                <Card className="flex gap-3 p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {listing.images?.[0] && (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white">
                      {listing.title}
                    </h3>
                    <p className="text-sm font-semibold text-primary-600">
                      {formatPrice(listing.price)}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* User's resources */}
      {resources?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            <BookOpen className="mr-2 inline h-5 w-5" /> Shared Resources
          </h2>
          <div className="space-y-2">
            {resources.map((resource: any) => (
              <Card key={resource._id} className="flex items-center gap-3 p-3">
                <BookOpen className="h-5 w-5 shrink-0 text-primary-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {resource.subject} • Sem {resource.semester}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
