"use client";

import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm",
          isOwn
            ? "rounded-br-lg bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-glow-sm"
            : "rounded-bl-lg bg-white/80 text-gray-900 backdrop-blur-xl border border-white/20 dark:bg-gray-700/80 dark:text-white dark:border-white/10"
        )}
      >
        {!isOwn && (
          <p className="mb-0.5 text-xs font-bold gradient-text">
            {message.senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p
          className={cn(
            "mt-1 text-right text-[10px]",
            isOwn ? "text-white/60" : "text-gray-400"
          )}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
