import { create } from "zustand";
import { Conversation } from "../components/types";

type ConversationStore = {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation: Conversation | null) =>
    set({ selectedConversation: conversation }),
}));
