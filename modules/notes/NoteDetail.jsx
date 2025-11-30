"use client";
import { useEffect, useState } from "react";
import { useFromStore } from "@/store/useFromStore";
import { EllipsisIcon } from "lucide-react";
import { useNoteFormStore } from "@/store/useNoteFormStore";
import { useColorStore } from "@/store/useColorStore";
import { Input } from "@/components/ui/input";
import CategoryPopup from "../category/CategoryPopup";
import NoteToggle1 from "./NoteToggle1";
import NoteToggle2 from "./NoteToggle2";
import Editor from "./Editor";
import { useCategoryLists } from "@/hooks/category/useCategoryLists";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NoteDetail({ initialData, refetchNote }) {
  const [editor, setEditor] = useState(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { data: categoryData, refetch } = useCategoryLists();
  const [buttonAction, setButtonAction] = useState(false);
  const { setColor } = useColorStore();

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

  // Zustand
  const { menuFrom: menu } = useFromStore();
  const bgStyle = { backgroundColor: selectedColor };

  useEffect(() => {
    if (initialData) {
      setNoteNo(initialData.noteNo);
      setTitle(initialData.title ?? "");
      setSelectedColor(initialData.color ?? "#FEF3C7");
      setSelectedCategoryNo(initialData.categoryNo ?? -1);
      setColor(initialData.color ?? "#FEF3C7");
      setIsPublic(initialData.isPublic ?? false);
      setIsLike(initialData?._count.likes > 0 ?? false);
      setIsSecret(initialData.isSecret ?? false);
    } else {
      setColor("#FEF3C7");
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

  return (
    <div
      className="relative flex flex-col p-2 rounded-md border"
      style={bgStyle}
    >
      {/* 카테고리 / 제목 / 메뉴 버튼 */}
      <div className="sticky top-14 z-30 bg-opacity-90 backdrop-blur-sm flex flex-col sm:flex-row justify-between gap-3 sm:items-center ">
        <div className="flex flex-1 flex-col sm:flex-row gap-1">
          <div className="flex justify-between items-center">
            <Select
              disabled={menu === "comunity"}
              value={selectedCategoryNo}
              onValueChange={(value) => {
                if (Number(value) === -2) {
                  setShowCategoryPopup(true);
                } else {
                  setSelectedCategoryNo(Number(value));
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <EllipsisIcon
              className="cursor-pointer sm:hidden"
              onClick={() => {
                setButtonAction(!buttonAction);
              }}
            />
          </div>

          <Input
            type="text"
            placeholder="제목을 입력하세요"
            className="bg-amber-100 text-xl font-semibold flex-1 mr-5"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            style={bgStyle}
            readOnly={menu === "community"}
          />
        </div>

        <EllipsisIcon
          className="cursor-pointer hidden sm:block"
          onClick={() => {
            setButtonAction(!buttonAction);
          }}
        />
      </div>

      {/* Editor 영역 */}
      <div className="flex-1" onClick={() => editor.chain().focus()}>
        <Editor
          setEditor={setEditor}
          content={initialData?.content ?? ""}
          menu={menu}
        />
      </div>

      {/* 팝업 영억 (카테고리, 메뉴토글) */}
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
    </div>
  );
}
