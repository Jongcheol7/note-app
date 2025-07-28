import { create } from "zustand";

export const useColorStore = create((set) => ({
  color: "#EBEAE8",
  setColor: (value) => set({ color: value }),
  initColor: () => set({ color: "#EBEAE8" }),
}));
