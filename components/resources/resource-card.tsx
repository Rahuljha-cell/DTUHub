"use client";

import {
  BookOpen,
  FileText,
  Download,
  Heart,
  ExternalLink,
  ClipboardList,
  BookMarked,
  File,
} from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Avatar from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils";

const typeIcons: Record<string, any> = {
  notes: FileText,
  pyq: ClipboardList,
  assignment: BookMarked,
  book: BookOpen,
  other: File,
};

const typeGradients: Record<string, string> = {
  notes: "from-blue-500 to-cyan-400",
  pyq: "from-orange-500 to-amber-400",
  assignment: "from-purple-500 to-violet-400",
  book: "from-emerald-500 to-teal-400",
  other: "from-gray-500 to-gray-400",
};

interface ResourceCardProps {
  resource: any;
  userId?: string;
  onLike: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function ResourceCard({
  resource,
  userId,
  onLike,
  onDownload,
}: ResourceCardProps) {
  const Icon = typeIcons[resource.type] || File;
  const hasLiked = userId && resource.likes?.includes(userId);
  const gradient = typeGradients[resource.type] || typeGradients.other;

  return (
    <Card>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 font-bold text-gray-900 dark:text-white">
              {resource.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge>{resource.subject}</Badge>
              <span className="text-xs text-gray-500">
                Sem {resource.semester}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{resource.branch}</span>
            </div>
            {resource.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {resource.description}
              </p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {resource.uploader && (
                  <>
                    <Link href={`/profile/${resource.uploader._id}`} className="shrink-0">
                      <Avatar
                        src={resource.uploader.avatar}
                        name={resource.uploader.name}
                        size="sm"
                      />
                    </Link>
                    <Link href={`/profile/${resource.uploader._id}`} className="font-medium hover:text-primary-600 transition-colors dark:hover:text-primary-400">
                      {resource.uploader.name}
                    </Link>
                    <span>•</span>
                  </>
                )}
                <span>{timeAgo(resource.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onLike(resource._id)}
                  className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                    hasLiked
                      ? "bg-red-50/80 text-red-500 dark:bg-red-900/20"
                      : "text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`}
                  />
                  {resource.likes?.length || 0}
                </button>
                {(resource.fileUrl || resource.link) && (
                  <a
                    href={resource.fileUrl || resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onDownload(resource._id)}
                    className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-400 transition-all duration-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
                  >
                    {resource.fileUrl ? (
                      <Download className="h-3.5 w-3.5" />
                    ) : (
                      <ExternalLink className="h-3.5 w-3.5" />
                    )}
                    {resource.downloads || 0}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
