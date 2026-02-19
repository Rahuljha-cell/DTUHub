"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { ChatMessage, ChatRoom } from "@/types";
import { sendMessage, subscribeToMessages } from "@/lib/chat";
import MessageBubble from "./message-bubble";

interface ChatWindowProps {
  chatId: string;
  chat: ChatRoom;
  userId: string;
  userName: string;
}

export default function ChatWindow({
  chatId,
  chat,
  userId,
  userName,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const otherUserId = Object.keys(chat.participants).find(
    (id) => id !== userId
  );
  const otherName = otherUserId
    ? chat.participantNames?.[otherUserId] || "User"
    : "User";

  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
    });
    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(chatId, userId, userName, text.trim());
      setText("");
    } catch {
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {otherName}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No messages yet. Say hello!
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === userId}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 p-3 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
