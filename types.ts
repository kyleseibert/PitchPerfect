export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  systemInstruction: string;
  avatar: string;
}

export interface SearchResult {
  text: string;
  sources: { uri: string; title: string }[];
}

export enum AppView {
  SELECTION = 'SELECTION',
  CHAT = 'CHAT'
}
