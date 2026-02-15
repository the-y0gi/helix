import { create } from "zustand";
import type { DateRange } from "react-day-picker";

type HotelContextStoreProps = {
  city: string;
  date: DateRange | undefined;
  checkIn: DateRange | undefined;
  guests: number;
  wrap: boolean;

  setCity: (city: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setCheckIn: (checkIn: DateRange | undefined) => void;
  setGuests: (guests: number) => void;
  setWrap: (wrap: boolean) => void;
};

export const useHotelStore = create<HotelContextStoreProps>((set) => ({
  city: "Goa",

  date: {
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  },

  checkIn: {
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  },

  guests: 2,
  wrap: false,

  setCity: (city) => set({ city }),
  setDate: (date) => set({ date }),
  setCheckIn: (checkIn) => set({ checkIn }),
  setGuests: (guests) => set({ guests }),
  setWrap: (wrap) => set({ wrap }),
}));
