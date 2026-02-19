"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ImageIcon, Send, X } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";

const POPULAR_TAGS = [
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

interface PostFormProps {
  onPost: (post: any) => void;
}

export default function PostForm({ onPost }: PostFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 5)
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 4 - images.length)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "image");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setImages((prev) => [...prev, data.url]);
        }
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Write something to post");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          tags: tags.length > 0 ? tags : undefined,
          images: images.length > 0 ? images : undefined,
        }),
      });

      if (!res.ok) throw new Error();
      const post = await res.json();
      onPost(post);
      setContent("");
      setTags([]);
      setImages([]);
      toast.success("Posted!");
    } catch {
      toast.error("Failed to post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex gap-3">
        <Avatar
          src={session?.user?.image}
          name={session?.user?.name || "User"}
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share updates, questions, or opportunities..."
            className="w-full resize-none border-none bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white"
            rows={3}
          />

          {/* Image previews */}
          {images.length > 0 && (
            <div className="mt-2 flex gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-0.5 top-0.5 rounded-full bg-red-500 p-0.5 text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  tags.includes(tag)
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 hover:text-primary-500">
              {uploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              Photo
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading || images.length >= 4}
              />
            </label>
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!content.trim()}
            >
              <Send className="h-3.5 w-3.5" /> Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
