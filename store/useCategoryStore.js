import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  categoryName: "",
  setCategoryName: (value) => set({ categoryName: value }),
}));
