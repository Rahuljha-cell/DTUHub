"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import ChatList from "@/components/chat/chat-list";
import ChatWindow from "@/components/chat/chat-window";
import { subscribeToUserChats } from "@/lib/chat";
import { ChatRoom } from "@/types";

export default function ChatPage() {
  const { data: session } = useSession();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name || "User";

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = subscribeToUserChats(userId, (userChats) => {
      setChats(userChats);
    });
    return unsubscribe;
  }, [userId]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Messages
      </h1>

      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" style={{ height: "calc(100vh - 180px)" }}>
        {/* Chat list sidebar */}
        <div className="w-80 shrink-0 border-r border-gray-200 overflow-y-auto dark:border-gray-700">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Conversations
            </h2>
          </div>
          <ChatList
            chats={chats}
            userId={userId || ""}
            activeChatId={activeChatId || undefined}
            onSelectChat={setActiveChatId}
          />
        </div>

        {/* Chat window */}
        <div className="flex-1">
          {activeChatId && activeChat ? (
            <ChatWindow
              chatId={activeChatId}
              chat={activeChat}
              userId={userId || ""}
              userName={userName}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <MessageCircle className="mb-3 h-12 w-12" />
              <p className="text-sm">
                Select a conversation or start a new one
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Chats are created when you rent an item or connect with a mentor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
