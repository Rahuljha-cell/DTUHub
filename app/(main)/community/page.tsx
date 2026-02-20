"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import PostCard from "@/components/community/post-card";
import PostForm from "@/components/community/post-form";
import toast from "react-hot-toast";

const TAGS = [
  "all",
  "placement",
  "exam",
  "hostel",
  "events",
  "internship",
  "project",
  "sports",
  "clubs",
  "lost-found",
  "general",
];

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-8 sm:px-6"><div className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" /></div>}>
      <CommunityContent />
    </Suspense>
  );
}

function CommunityContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTag = searchParams.get("tag") || "all";

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTag !== "all") params.set("tag", activeTag);
      const res = await fetch(`/api/community?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [activeTag, fetchPosts]);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch("/api/community", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "like" }),
      });
      if (res.ok) fetchPosts();
    } catch {
      toast.error("Failed");
    }
  };

  const handleComment = async (postId: string, text: string) => {
    try {
      const res = await fetch("/api/community", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "comment", text }),
      });
      if (res.ok) fetchPosts();
    } catch {
      toast.error("Failed");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch("/api/community", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "delete" }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        toast.success("Post deleted");
      }
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleNewPost = (post: any) => {
    setPosts((prev) => [post, ...prev]);
  };

  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Community
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Connect, share updates, and stay in the loop with DTU students.
      </p>

      {/* Tags filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              const params = new URLSearchParams();
              if (tag !== "all") params.set("tag", tag);
              router.push(`/community?${params.toString()}`);
            }}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activeTag === tag
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {tag === "all" ? "All" : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Post form */}
      {session && <PostForm onPost={handleNewPost} />}

      {/* Posts */}
      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No posts yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Be the first to share something with the community!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              userId={(session?.user as any)?.id}
              isAdmin={isAdmin}
              onLike={handleLike}
              onComment={handleComment}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
}
