import { create } from 'zustand';
import { chatApi, type ApiConversation } from '../services/engagementApi';

type ChatStore = {
  conversations: ApiConversation[];
  loading: boolean;
  error: string | null;

  loadConversations: () => Promise<void>;
  getConversation: (id: string) => Promise<ApiConversation>;
  createConversation: (message?: string) => Promise<ApiConversation>;
  sendMessage: (conversationId: string, content: string) => Promise<ApiConversation>;
  removeConversation: (id: string) => Promise<void>;
};

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  loading: false,
  error: null,

  loadConversations: async () => {
    set({ loading: true, error: null });
    try {
      const conversations = await chatApi.list();
      set({ conversations, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  getConversation: id => chatApi.get(id),

  createConversation: async message => {
    const conversation = await chatApi.create(message);
    set(state => ({ conversations: [conversation, ...state.conversations] }));
    return conversation;
  },

  sendMessage: (conversationId, content) => chatApi.send(conversationId, content),

  removeConversation: async id => {
    await chatApi.remove(id);
    set(state => ({ conversations: state.conversations.filter(c => c.id !== id) }));
  },
}));
