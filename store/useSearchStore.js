import { create } from "zustand";

export const useSearchStore = create((set) => ({
  keyword: "",
  setKeyword: (value) => set({ keyword: value }),
}));
