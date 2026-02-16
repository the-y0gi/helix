import { create } from "zustand";
import type { DateRange } from "react-day-picker";

type HotelContextStoreProps = {
  city: string;
  date: DateRange | undefined;
  checkIn: DateRange | undefined;
  wrap: boolean;
  booking: boolean;
  hotel: {
    id: string;
    image: string;
    name: string;
    rating: number;
    price: number;
    reviewCount: number;
    totalPrice: number;
  };

  guests: {
    adults: number;
    children: number;
  };

  setCity: (city: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setCheckIn: (checkIn: DateRange | undefined) => void;
  setWrap: (wrap: boolean) => void;
  setBooking: (booking: boolean) => void;

  setGuests: (guests: { adults: number; children: number }) => void;
  setHotel: (hotel: {
    id: string;
    image: string;
    name: string;
    rating: number;
    price: number;
    reviewCount: number;
    totalPrice: number;
  }) => void;
};

export const useHotelStore = create<HotelContextStoreProps>((set) => ({
  city: "Goa",
  hotel: {
    id: "",
    image: "/img4.png",
    name: "Hotel Arts Barcelona",
    rating: 5,
    reviewCount: 1260,
    price: 100,
    totalPrice: 1450,
  },

  date: {
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  },

  guests: {
    adults: 0,
    children: 0,
  },

  checkIn: {
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  },

  wrap: false,
  booking: true,

  setCity: (city) => set({ city }),
  setDate: (date) => set({ date }),
  setCheckIn: (checkIn) => set({ checkIn }),
  setWrap: (wrap) => set({ wrap }),
  setBooking: (booking) => set({ booking }),
  setGuests: (guests) => set({ guests }),
  setHotel: (hotel) => set({ hotel }),
}));
