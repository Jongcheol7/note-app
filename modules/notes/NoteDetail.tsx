"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFromStore } from "@/store/useFromStore";
import { ChevronLeft, EllipsisVertical } from "lucide-react";
import { useNoteFormStore } from "@/store/useNoteFormStore";
import { useColorStore } from "@/store/useColorStore";
import CategoryPopup from "../category/CategoryPopup";
import NoteToggle1 from "./NoteToggle1";
import NoteToggle2 from "./NoteToggle2";
import Editor from "./Editor";
import NoteToolbar from "./NoteToolbar";
import { useCategoryLists } from "@/hooks/category/useCategoryLists";
import { MENU, DEFAULT_NOTE_COLOR } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoteData {
  noteNo: number;
  title: string;
  content: string;
  color: string | null;
  categoryNo: number | null;
  sortOrder: number;
  isPublic: boolean;
  isSecret: boolean;
  delDatetime: string | null;
  _count: { likes: number };
  [key: string]: unknown;
}

interface NoteDetailProps {
  initialData?: NoteData;
  refetchNote?: () => void;
}

export default function NoteDetail({ initialData, refetchNote }: NoteDetailProps) {
  const [editor, setEditor] = useState(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { data: categoryData, refetch } = useCategoryLists();
  const [buttonAction, setButtonAction] = useState(false);
  const { setColor } = useColorStore();
  const router = useRouter();

  const {
    noteNo,
    setNoteNo,
    title,
    setTitle,
    categories,
    setCategories,
    selectedCategoryNo,
    setSelectedCategoryNo,
    selectedColor,
    setSelectedColor,
    setIsPublic,
    setIsLike,
    setIsSecret,
    reset,
  } = useNoteFormStore();

  const { menuFrom: menu } = useFromStore();

  useEffect(() => {
    if (initialData) {
      setNoteNo(initialData.noteNo);
      setTitle(initialData.title ?? "");
      setSelectedColor(initialData.color ?? DEFAULT_NOTE_COLOR);
      setSelectedCategoryNo(initialData.categoryNo ?? -1);
      setColor(initialData.color ?? DEFAULT_NOTE_COLOR);
      setIsPublic(initialData.isPublic ?? false);
      setIsLike((initialData?._count.likes ?? 0) > 0);
      setIsSecret(initialData.isSecret ?? false);
    } else {
      setColor(DEFAULT_NOTE_COLOR);
    }
    if (categoryData) {
      const newCats = categoryData.map((cat) => ({
        id: cat.categoryNo,
        name: cat.name,
      }));
      setCategories(newCats);
    }

    return () => reset();
  }, [
    initialData,
    categoryData,
    reset,
    setTitle,
    setCategories,
    setNoteNo,
    setSelectedCategoryNo,
    setSelectedColor,
  ]);

  const isCommunity = menu === MENU.COMMUNITY;

  return (
    <>
      {/* ── 헤더 바 (뷰포트 상단 고정) ── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 border-b border-black/10"
        style={{ backgroundColor: selectedColor, filter: "brightness(0.93)" }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-1 px-2 h-12">
          <button
            onClick={() => router.back()}
            aria-label="뒤로가기"
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <Select
            disabled={isCommunity}
            value={String(selectedCategoryNo)}
            onValueChange={(value) => {
              if (Number(value) === -2) {
                setShowCategoryPopup(true);
              } else {
                setSelectedCategoryNo(Number(value));
              }
            }}
          >
            <SelectTrigger className="w-auto max-w-[120px] h-7 text-xs bg-white/50 border-none rounded-full px-2.5 gap-1">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <button
            onClick={() => setButtonAction(!buttonAction)}
            aria-label="메뉴 열기"
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
          >
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── 본문 영역 (일반 flow, 상하 고정바 공간 확보) ── */}
      <div className="pt-12 pb-16" style={{ backgroundColor: selectedColor }}>
        {/* 제목 */}
        <div className="px-4 pt-3 pb-2 border-b border-black/[0.08]">
          <input
            type="text"
            placeholder="제목"
            className="w-full bg-transparent text-xl font-bold outline-none placeholder:text-foreground/25"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            readOnly={isCommunity}
          />
        </div>

        {/* 에디터 */}
        <div
          className="px-4 min-h-[60vh]"
          onClick={() => editor?.chain().focus()}
        >
          <Editor
            setEditor={setEditor}
            content={initialData?.content ?? ""}
            menu={menu}
          />
        </div>
      </div>

      {/* ── 툴바 (뷰포트 하단 고정) ── */}
      {!isCommunity && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10"
          style={{ backgroundColor: selectedColor, filter: "brightness(0.93)" }}
        >
          <div className="max-w-lg mx-auto px-2 py-2.5">
            <NoteToolbar editor={editor} />
          </div>
        </div>
      )}

      {/* 팝업들 */}
      {showCategoryPopup && (
        <CategoryPopup setShow={setShowCategoryPopup} refetch={refetch} />
      )}

      {buttonAction && !initialData?.delDatetime && (
        <NoteToggle1
          setButtonAction={setButtonAction}
          initialData={initialData}
          refetchNote={refetchNote}
          editor={editor}
        />
      )}
      {buttonAction && initialData?.delDatetime && (
        <NoteToggle2
          noteNo={noteNo}
          setButtonAction={setButtonAction}
          initialData={initialData}
        />
      )}
    </>
  );
}
