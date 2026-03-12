import { create } from "zustand";

interface Category {
  id: number;
  name: string;
}

interface NoteFormState {
  noteNo: number | null;
  categories: Category[];
  selectedCategoryNo: number;
  title: string;
  selectedColor: string;
  alarmDatetime: string | null;
  isPublic: boolean;
  isLike: boolean;
  isSecret: boolean;

  setNoteNo: (val: number | null) => void;
  setCategories: (cats: Category[]) => void;
  setSelectedCategoryNo: (no: number) => void;
  setTitle: (val: string) => void;
  setSelectedColor: (val: string) => void;
  setAlarmDatetime: (date: string | null) => void;
  setIsPublic: (val: boolean) => void;
  setIsLike: (val: boolean) => void;
  setIsSecret: (val: boolean) => void;
  reset: () => void;
}

export const useNoteFormStore = create<NoteFormState>((set) => ({
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

  setNoteNo: (val: number | null) => set({ noteNo: val }),
  setCategories: (cats: Category[]) =>
    set({
      categories: [
        { id: -2, name: "➕ 추가" },
        { id: -1, name: "분류되지 않음" },
        ...cats,
      ],
    }),
  setSelectedCategoryNo: (no: number) => set({ selectedCategoryNo: no }),
  setTitle: (val: string) => set({ title: val }),
  setSelectedColor: (val: string) => set({ selectedColor: val }),
  setAlarmDatetime: (date: string | null) => set({ alarmDatetime: date }),
  setIsPublic: (val: boolean) => set({ isPublic: val }),
  setIsLike: (val: boolean) => set({ isLike: val }),
  setIsSecret: (val: boolean) => set({ isSecret: val }),

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
      isPublic: false,
      isLike: false,
      isSecret: false,
    });
  },
}));
