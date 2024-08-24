import { AmenityCategoryType, AmenityType, HotelType, UserType } from "@/types";
import { create } from "zustand";

interface AmenityStoreType {
  data?: AmenityType[];
  updateData: (newData: AmenityType[]) => void;
  dataCategory?: AmenityCategoryType[];
  updateDataCategory: (newDataCategory: AmenityCategoryType[]) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useAmenetyStore = create<AmenityStoreType>((set) => ({
  data: [],
  updateData: (newData: AmenityType[]) => set({ data: newData }),
  dataCategory: [],
  updateDataCategory: (newDataCategory: AmenityCategoryType[]) => set({ dataCategory: newDataCategory }),
}));
