"use client";

import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/avatar";
import { ChatRoom } from "@/types";

interface ChatListProps {
  chats: ChatRoom[];
  userId: string;
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export default function ChatList({
  chats,
  userId,
  activeChatId,
  onSelectChat,
}: ChatListProps) {
  return (
    <div className="flex flex-col">
      {chats.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-500">
          No conversations yet. Start by renting an item or connecting with a
          mentor!
        </div>
      ) : (
        chats.map((chat) => {
          const otherUserId = Object.keys(chat.participants).find(
            (id) => id !== userId
          );
          const otherName = otherUserId
            ? chat.participantNames?.[otherUserId] || "User"
            : "User";

          return (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "flex items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
                activeChatId === chat.id && "bg-primary-50 dark:bg-primary-900/20"
              )}
            >
              <Avatar name={otherName} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {otherName}
                  </p>
                  {chat.lastMessageTime && (
                    <span className="shrink-0 text-xs text-gray-400">
                      {timeAgo(new Date(chat.lastMessageTime))}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {chat.lastMessage}
                  </p>
                )}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
