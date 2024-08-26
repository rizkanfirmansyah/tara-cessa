import { LoungeType } from "@/types/RoomType";
import { create } from "zustand";

interface LoungeStoreType {
  data?: LoungeType[];
  updateData: (newData: LoungeType[]) => void;
  dataDetail?: LoungeType | null;
  updateDataDetail: (newData: LoungeType) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useLoungeStore = create<LoungeStoreType>((set) => ({
  data: [],
  updateData: (newData: LoungeType[]) => set({ data: newData }),
  dataDetail: null,
  updateDataDetail: (newData: LoungeType) => set({ dataDetail: newData }),
}));
