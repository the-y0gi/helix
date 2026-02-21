import { axiosApi } from "@/lib/axios";
import { create } from "zustand";

interface Routes {
  nextRoute: string;
  setNextRoute: (route: string) => void;
}
export const useRoutingStore = create<Routes>((set, get) => ({
  nextRoute: "/",
  setNextRoute: (route: string) => set({ nextRoute: route }),
}));