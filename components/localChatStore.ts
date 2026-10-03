export type LocalChatMessage = {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  time: string;
};

const storageKey = 'smarttask.localChatMessages.v1';

export function readLocalChatMessages(): LocalChatMessage[] {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((message): message is LocalChatMessage =>
      typeof message === 'object' && message !== null &&
      'id' in message && typeof message.id === 'string' &&
      'conversationId' in message && typeof message.conversationId === 'string' &&
      'sender' in message && typeof message.sender === 'string' &&
      'text' in message && typeof message.text === 'string' &&
      'time' in message && typeof message.time === 'string'
    );
  } catch {
    return [];
  }
}

export function saveLocalChatMessage(message: LocalChatMessage): void {
  localStorage.setItem(storageKey, JSON.stringify([...readLocalChatMessages(), message]));
}
