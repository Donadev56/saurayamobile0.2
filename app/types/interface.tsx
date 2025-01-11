import { ChatResponse } from 'ollama';

export interface MessageInterface {
  role: 'assistant' | 'user' | 'system';
  content: string;
  images?: [string];
}

export interface OllamaChatRequest {
  model: string;
  messages: MessageInterface[];
  stream?: boolean;
}

export interface PartialResponse {
  isFirst: boolean;
  response: ChatResponse;
}

export interface Conversation {
  title: string;
  messages: MessageInterface[];
}

export type ConversationsInterface = {
  [date: string]: {
    [conversationId: string]: Conversation;
  };
};


export interface RequestData {
  title : string,
}