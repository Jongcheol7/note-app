import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FromState {
  menuFrom: string;
  setMenuFrom: (value: string) => void;
}

export const useFromStore = create<FromState>()(
  persist(
    (set) => ({
      menuFrom: "",
      setMenuFrom: (value: string) => set({ menuFrom: value }),
    }),
    { name: "menu-from-storage" }
  )
);
