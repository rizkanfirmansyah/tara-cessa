import { OrderType } from "@/types";
import { create } from "zustand";

interface OrderStoreType {
  data?: OrderType[];
  updateData: (newData: OrderType[]) => void;
  dataDetail?: OrderType | null;
  updateDataDetail: (newData: OrderType) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useOrderStore = create<OrderStoreType>((set) => ({
  data: [],
  updateData: (newData: OrderType[]) => set({ data: newData }),
  dataDetail: null,
  updateDataDetail: (newData: OrderType) => set({ dataDetail: newData }),
}));
