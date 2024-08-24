import { FacilityCategoryType, FacilityType, HotelType, UserType } from "@/types";
import { create } from "zustand";

interface FacilityStoreType {
  data?: FacilityType[];
  updateData: (newData: FacilityType[]) => void;
  dataCategory?: FacilityCategoryType[];
  updateDataCategory: (newDataCategory: FacilityCategoryType[]) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useFacilityStore = create<FacilityStoreType>((set) => ({
  data: [],
  updateData: (newData: FacilityType[]) => set({ data: newData }),
  dataCategory: [],
  updateDataCategory: (newDataCategory: FacilityCategoryType[]) => set({ dataCategory: newDataCategory }),
}));
