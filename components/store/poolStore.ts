import { PoolTableType } from "@/types/RoomType";
import { create } from "zustand";

interface PoolStoreType {
  data?: PoolTableType[];
  updateData: (newData: PoolTableType[]) => void;
  dataDetail?: PoolTableType | null;
  updateDataDetail: (newData: PoolTableType) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const usePoolStore = create<PoolStoreType>((set) => ({
  data: [],
  updateData: (newData: PoolTableType[]) => set({ data: newData }),
  dataDetail: null,
  updateDataDetail: (newData: PoolTableType) => set({ dataDetail: newData }),
}));
