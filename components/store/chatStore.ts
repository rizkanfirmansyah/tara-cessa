import { ChatDepartementType } from "@/types";
import { ChatType } from "@/types/ChatType";
import { create } from "zustand";

interface ChatStoreType {
    data?: ChatDepartementType[];
    updateData: (newData: ChatDepartementType[]) => void;
    dataChat?: ChatType[];
    updateDataChat: (newData: ChatType[]) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useChatStore = create<ChatStoreType>((set) => ({
    data: [],
    updateData: (newData: ChatDepartementType[]) => set({ data: newData }),
    dataChat: [],
    updateDataChat: (newData: ChatType[]) => set({ dataChat: newData }),
}));
