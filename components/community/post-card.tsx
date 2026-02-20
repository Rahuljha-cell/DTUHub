"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Send, Trash2, Shield } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { timeAgo, cn } from "@/lib/utils";

interface PostCardProps {
  post: any;
  userId?: string;
  isAdmin?: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({
  post,
  userId,
  isAdmin,
  onLike,
  onComment,
  onDelete,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const hasLiked = userId && post.likes?.includes(userId);

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(post._id, commentText.trim());
    setCommentText("");
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        {/* Author */}
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author?._id}`} className="shrink-0">
            <Avatar
              src={post.author?.avatar}
              name={post.author?.name || "User"}
            />
          </Link>
          <div>
            <Link
              href={`/profile/${post.author?._id}`}
              className="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors dark:text-white dark:hover:text-primary-400"
            >
              {post.author?.name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {post.author?.branch && <span>{post.author.branch}</span>}
              {post.author?.year && <span>• Year {post.author.year}</span>}
              <span>• {timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="info">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Images */}
        {post.images?.length > 0 && (
          <div className="mt-3 grid gap-2" style={{
            gridTemplateColumns: post.images.length === 1 ? "1fr" : "1fr 1fr"
          }}>
            {post.images.map((img: string, i: number) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-4 border-t border-gray-100/50 pt-3 dark:border-gray-700/50">
          <button
            onClick={() => onLike(post._id)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-300",
              hasLiked
                ? "bg-red-50/80 text-red-500 dark:bg-red-900/20"
                : "text-gray-500 hover:bg-gray-100/80 hover:text-red-500 dark:hover:bg-gray-800/80"
            )}
          >
            <Heart
              className={cn("h-4 w-4", hasLiked && "fill-current")}
            />
            {post.likes?.length || 0}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-primary-50/80 hover:text-primary-500 dark:hover:bg-primary-950/30"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments?.length || 0}
          </button>
          {(isAdmin || post.author?._id === userId) && onDelete && (
            <button
              onClick={() => {
                if (confirm("Delete this post?")) onDelete(post._id);
              }}
              className="ml-auto flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-red-500 transition-all duration-300 hover:bg-red-50/80 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3 space-y-3">
            {post.comments?.map((comment: any, i: number) => (
              <div key={i} className="flex gap-2">
                <Link href={`/profile/${comment.user?._id}`} className="shrink-0">
                  <Avatar
                    src={comment.user?.avatar}
                    name={comment.user?.name || "User"}
                    size="sm"
                  />
                </Link>
                <div className="rounded-xl bg-gray-50/80 px-3 py-2 backdrop-blur-sm dark:bg-gray-700/50">
                  <Link href={`/profile/${comment.user?._id}`} className="text-xs font-bold text-gray-900 hover:text-primary-600 transition-colors dark:text-white dark:hover:text-primary-400">
                    {comment.user?.name}
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-xl border border-white/20 bg-white/80 px-4 py-2 text-sm backdrop-blur-sm transition-all focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-gray-800/80 dark:text-white"
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-glow-sm transition-all hover:shadow-glow disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
