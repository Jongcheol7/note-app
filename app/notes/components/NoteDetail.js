"use client";
import Editor from "@app/notes/components/Editor";
import NoteToolbar from "@app/notes/components/NoteToolbar";
import { useEffect, useState } from "react";
import { useFromStore } from "@/store/useFromStore";
import { useCategoryLists } from "@/app/category/hooks/useCategoryLists";
import NoteToggle2 from "./NoteToggle2";
import NoteToggle1 from "./NoteToggle1";
import CategoryPopup from "@/app/category/components/CategoryPopup";
import { EllipsisIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNoteFormStore } from "@/store/useNoteFormStore";

export default function NoteDetail({ initialData, refetchNote }) {
  console.log("이니셜데이터 : ", initialData);
  const [editor, setEditor] = useState(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { data: categoryData, refetch } = useCategoryLists();
  const [buttonAction, setButtonAction] = useState(false);

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
    reset,
  } = useNoteFormStore();

  //const likeCnt = initialData?._count.likes;

  // Zustand
  const { menuFrom: menu } = useFromStore();
  const bgStyle = { backgroundColor: selectedColor };

  useEffect(() => {
    if (initialData) {
      setNoteNo(initialData.noteNo);
      setTitle(initialData.title ?? "");
      setSelectedColor(initialData.color ?? "#FEF3C7");
      setSelectedCategoryNo(initialData.categoryNo ?? -1);
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
      className="relative flex flex-col h-[calc(100vh-150px)] px-2 rounded-md"
      style={bgStyle}
    >
      {/* 카테고리 및 토글버튼 */}
      <div className="flex gap-3">
        <select
          className="ml-auto w-auto max-w-[200px] px-2 py-1 rounded-md text-sm border-gray-400 border border-b"
          style={bgStyle}
          disabled={menu === "community"}
          value={selectedCategoryNo}
          onChange={(e) => {
            const selected = e.target.value;
            if (selected === "-2") {
              setShowCategoryPopup(true);
            } else {
              setSelectedCategoryNo(Number(selected));
            }
          }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <EllipsisIcon
          className="cursor-pointer"
          onClick={() => {
            setButtonAction(!buttonAction);
          }}
        />
      </div>

      {/* 제목 INPUT */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          className="bg-amber-100 text-xl font-semibold flex-1"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          style={bgStyle}
          readOnly={menu === "community"}
        />
      </div>

      {/* 카테고리 팝업 */}
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

      {/* Editor 영역 */}
      <div
        className="flex-1 overflow-y-auto"
        onClick={() => editor.chain().focus()}
      >
        <Editor
          onEditorReady={setEditor}
          content={initialData?.content ?? ""}
          menu={menu}
        />
      </div>
      <NoteToolbar editor={editor} />
    </div>
  );
}
