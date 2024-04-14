// chat-message.dto.ts
export interface ChatMessage {
  messageId: string;
  senderId: string;
  name: string;
  content: string;
  timestamp: Date;
  user: boolean
  finalChunk?: boolean; // Optional, used if implementing chunked messages
}

// user-status.dto.ts
export interface UserStatus {
  userId: string;
  isOnline: boolean;
}
