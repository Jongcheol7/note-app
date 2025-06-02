import { create } from "zustand";

export const ColorStore = create((set) => ({
  color: "#FEF3C7",
  setColor: (value) => set({ color: value }),
  initColor: () => set({ color: "#FEF3C7" }),
}));
