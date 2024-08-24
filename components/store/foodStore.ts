import { FoodType } from "@/types";
import { FoodAdditionalType, FoodCategoryType } from "@/types/FoodType";
import { create } from "zustand";

interface FoodStoreType {
    data?: FoodType[];
    updateData: (newData: FoodType[]) => void;
    dataCategory?: FoodCategoryType[];
    updateDataCategory: (newDataCategory: FoodCategoryType[]) => void;
    additionalData?: FoodAdditionalType[];
    updateAdditionalData: (newAdditionalData: FoodAdditionalType[]) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useFoodStore = create<FoodStoreType>((set) => ({
    data: [],
    updateData: (newData: FoodType[]) => set({ data: newData }),
    dataCategory: [],
    updateDataCategory: (newDataCategory: FoodCategoryType[]) => set({ dataCategory: newDataCategory }),
    additionalData: [],
    updateAdditionalData: (newAdditionalData: FoodAdditionalType[]) => set({ additionalData: newAdditionalData }),
}));
