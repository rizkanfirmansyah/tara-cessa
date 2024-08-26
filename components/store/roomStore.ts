import { RoomManageType } from "@/types/RoomType";
import { create } from "zustand";

interface RoomStoreType {
  data?: RoomManageType[];
  updateData: (newData: RoomManageType[]) => void;
  dataDetail?: RoomManageType | null;
  updateDataDetail: (newData: RoomManageType) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useRoomStore = create<RoomStoreType>((set) => ({
  data: [],
  updateData: (newData: RoomManageType[]) => set({ data: newData }),
  dataDetail: null,
  updateDataDetail: (newData: RoomManageType) => set({ dataDetail: newData }),
}));
