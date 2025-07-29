import { create } from "zustand";

export const useNoteFormStore = create((set) => ({
  noteNo: null,
  categories: [
    { id: -2, name: "➕ 추가" },
    { id: -1, name: "분류되지 않음" },
  ],
  selectedCategoryNo: -1,
  title: "",
  selectedColor: "#FEF3C7",
  alarmDatetime: null,
  isPublic: false,
  isLike: false,
  isSecret: false,

  setNoteNo: (val) => set({ noteNo: val }),
  setCategories: (cats) =>
    set({
      categories: [
        { id: -2, name: "➕ 추가" },
        { id: -1, name: "분류되지 않음" },
        ...cats,
      ],
    }),
  setSelectedCategoryNo: (no) => set({ selectedCategoryNo: no }),
  setTitle: (val) => set({ title: val }),
  setSelectedColor: (val) => set({ selectedColor: val }),
  setAlarmDatetime: (date) => set({ alarmDatetime: date }),
  setIsPublic: (val) => set({ isPublic: val }),
  setIsLike: (val) => set({ isLike: val }),
  setIsSecret: (val) => set({ isSecret: val }),

  reset: () => {
    set({
      noteNo: null,
      categories: [
        { id: -2, name: "➕ 추가" },
        { id: -1, name: "분류되지 않음" },
      ],
      title: "",
      selectedColor: "#FEF3C7",
      alarmDatetime: null,
      isPublic: true,
      isLike: false,
      isSecret: false,
    });
  },
}));
