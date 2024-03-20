// chat-message.dto.ts
export interface ChatMessage {
  messageId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isFinalChunk?: boolean; // Optional, used if implementing chunked messages
}

// user-status.dto.ts
export interface UserStatus {
  userId: string;
  isOnline: boolean;
}
