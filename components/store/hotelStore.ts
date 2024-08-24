import { HotelProfileType, HotelType, UserType } from "@/types";
import { create } from "zustand";

interface HotelStoreType {
    data?: HotelType[];
    dataProfile?: HotelProfileType | null;
    dataRow?: HotelType | null;
    hotelID?: number;
    updateData: (newData: HotelType[]) => void;
    updateDataProfile: (newData: HotelProfileType) => void;
    updateDataRow: (newData: HotelType) => void;
    setHotelID: (hotelID: number) => void;
}

// Create the store with Zustand, combining the status interface and actions
export const useHotelStore = create<HotelStoreType>((set) => ({
    data: [],
    dataProfile: null,
    dataRow: null,
    hotelID: typeof window !== "undefined" ? parseInt(localStorage.getItem("hotelID") ?? "0") ?? 0 : 0,
    updateData: (newData: HotelType[]) => {
        set({ data: newData });
        if (typeof window !== "undefined") {
            localStorage.setItem("hotelData", JSON.stringify(newData));
        }
    },
    updateDataProfile: (newData: HotelProfileType) => {
        set({ dataProfile: newData });
    },
    updateDataRow: (newData: HotelType) => {
        set({ dataRow: newData });
    },
    setHotelID: (hotelID: number) => {
        set({ hotelID: hotelID });
        if (typeof window !== "undefined") {
            localStorage.setItem("hotelID", hotelID.toString());
        }
    },
}));
