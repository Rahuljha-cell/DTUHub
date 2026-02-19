import { getRtdb } from "./firebase";
import {
  ref,
  push,
  set,
  onValue,
  query,
  orderByChild,
  get,
  off,
} from "firebase/database";
import { ChatMessage, ChatRoom } from "@/types";

function getChatId(userId1: string, userId2: string) {
  return [userId1, userId2].sort().join("_");
}

export async function createOrGetChat(
  userId1: string,
  userName1: string,
  userId2: string,
  userName2: string
): Promise<string> {
  const chatId = getChatId(userId1, userId2);
  const chatRef = ref(getRtdb(), `chats/${chatId}`);

  const snapshot = await get(chatRef);
  if (!snapshot.exists()) {
    await set(chatRef, {
      participants: { [userId1]: true, [userId2]: true },
      participantNames: { [userId1]: userName1, [userId2]: userName2 },
      createdAt: Date.now(),
    });
  }

  return chatId;
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  senderName: string,
  text: string
) {
  const db = getRtdb();
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const newMsgRef = push(messagesRef);

  await set(newMsgRef, {
    senderId,
    senderName,
    text,
    timestamp: Date.now(),
  });

  const chatRef = ref(db, `chats/${chatId}`);
  const snapshot = await get(chatRef);
  if (snapshot.exists()) {
    await set(ref(db, `chats/${chatId}/lastMessage`), text);
    await set(ref(db, `chats/${chatId}/lastMessageTime`), Date.now());
  }
}

export function subscribeToMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void
) {
  const db = getRtdb();
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderByChild("timestamp"));

  onValue(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((child) => {
      messages.push({
        id: child.key!,
        ...child.val(),
      });
    });
    callback(messages);
  });

  return () => off(messagesRef);
}

export function subscribeToUserChats(
  userId: string,
  callback: (chats: ChatRoom[]) => void
) {
  const db = getRtdb();
  const chatsRef = ref(db, "chats");

  onValue(chatsRef, (snapshot) => {
    const chats: ChatRoom[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.participants && data.participants[userId]) {
        chats.push({
          id: child.key!,
          ...data,
        });
      }
    });
    chats.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
    callback(chats);
  });

  return () => off(chatsRef);
}
