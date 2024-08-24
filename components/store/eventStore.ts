import { EventCategoryType, EventType } from "@/types";
import { create } from "zustand";

interface EventStoreType {
    data?: EventType[];
    updateData: (newData: EventType[]) => void;
    dataCategory?: EventCategoryType[];
    updateDataCategory: (newDataCategory: EventCategoryType[]) => void;
}

export const useEventStore = create<EventStoreType>((set) => ({
    data: [],
    updateData: (newData: EventType[]) => set({ data: newData }),
    dataCategory: [],
    updateDataCategory: (newDataCategory: EventCategoryType[]) => set({ dataCategory: newDataCategory }),
}));
