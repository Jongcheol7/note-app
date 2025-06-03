import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFromStore = create(
  persist(
    (set) => ({
      menuFrom: "",
      setMenuFrom: (value) => set({ menuFrom: value }),
    }),
    { name: "menu-from-storage" }
  )
);
