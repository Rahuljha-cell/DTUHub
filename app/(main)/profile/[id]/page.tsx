"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  BookOpen,
  Star,
  MessageCircle,
  Shield,
  Ban,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { createOrGetChat } from "@/lib/chat";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUserData(data);
      } catch {
        toast.error("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params.id]);

  const handleChat = async () => {
    const userId = (session?.user as any)?.id;
    const userName = session?.user?.name || "User";
    if (!userId || !userData?.user) return;

    try {
      await createOrGetChat(
        userId,
        userName,
        userData.user._id,
        userData.user.name
      );
      router.push("/chat");
    } catch {
      toast.error("Failed to create chat");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const { user, listings, resources, stats } = userData;
  const isOwnProfile = (session?.user as any)?.id === user._id;
  const isAdmin = (session?.user as any)?.role === "admin";

  const handleAdminAction = async (action: string) => {
    const label = action === "ban" ? "ban" : action === "unban" ? "unban" : action === "delete" ? "permanently delete" : action;
    if (!confirm(`Are you sure you want to ${label} this user?`)) return;

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminAction: action }),
      });
      if (res.ok) {
        toast.success(`User ${action === "ban" ? "banned" : action === "unban" ? "unbanned" : "deleted"} successfully`);
        if (action === "delete") {
          router.push("/browse");
        } else {
          window.location.reload();
        }
      }
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {user.name}
                    </h1>
                    {user.role === "admin" && (
                      <Badge variant="info" className="gap-1">
                        <Shield className="h-3 w-3" /> Admin
                      </Badge>
                    )}
                    {user.role === "banned" && (
                      <Badge variant="danger" className="gap-1">
                        <Ban className="h-3 w-3" /> Banned
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {user.branch}
                    {user.year && ` • Year ${user.year}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isOwnProfile && (
                    <Button onClick={handleChat}>
                      <MessageCircle className="h-4 w-4" /> Message
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

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

          {user.bio && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
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
      </Card>

      {/* Admin Controls */}
      {isAdmin && !isOwnProfile && (
        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200/50 bg-red-50/50 px-5 py-3 dark:border-gray-700/50 dark:bg-red-950/20">
            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
            <h2 className="text-sm font-bold text-red-700 dark:text-red-400">Admin Controls</h2>
          </div>
          <div className="flex flex-wrap gap-2 p-4">
            {user.role !== "banned" ? (
              <Button variant="danger" size="sm" onClick={() => handleAdminAction("ban")}>
                <Ban className="h-3.5 w-3.5" /> Ban User
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleAdminAction("unban")}>
                <ShieldCheck className="h-3.5 w-3.5" /> Unban User
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => handleAdminAction("delete")}>
              <Trash2 className="h-3.5 w-3.5" /> Delete User & Content
            </Button>
          </div>
        </Card>
      )}

      {listings?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            <Package className="mr-2 inline h-5 w-5" /> Listings
          </h2>
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
