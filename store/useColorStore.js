import { create } from "zustand";

export const useColorStore = create((set) => ({
  color: "#FEF3C7",
  setColor: (value) => set({ color: value }),
  initColor: () => set({ color: "#FEF3C7" }),
}));
