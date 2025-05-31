"use client";
import Editor from "@app/notes/components/Editor";
import NoteToolbar from "@app/notes/components/NoteToolbar";
import { useNoteMutation } from "@app/notes/hooks/useNoteMutation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryPopup from "@app/notes/components/CategoryPopup";
import { useCategoryLists } from "../hooks/useCategoryLists";

export default function NoteDetail({ initialData, refetchNote }) {
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const { mutate, isPending } = useNoteMutation();
  const router = useRouter();
  const [categories, setCategories] = useState([
    { id: -2, name: "➕ 추가" },
    { id: -1, name: "분류되지 않음" },
  ]);
  const [selectedCategoryNo, setSelectedCategoryNo] = useState(
    initialData?.categoryNo ?? -1
  );
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  const { data: categoryData, refetch } = useCategoryLists();
  // 카테고리 데이터를 가져오자
  useEffect(() => {
    if (categoryData) {
      const converted = [
        { id: -2, name: "➕ 추가" },
        { id: -1, name: "분류되지 않음" },
        ...categoryData.map((category) => ({
          id: category.categoryNo,
          name: category.name,
        })),
      ];
      setCategories(converted);
    }
  }, [categoryData]);

  // editor가 업데이트 될때마다 내용 추출해서 저장하자
  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => {
      const html = editor.getHTML();
      setContent(html);
    };
    editor.on("update", handleUpdate);
    return () => editor.off("update", handleUpdate);
  }, [editor]);

  return (
    <div className="relative flex flex-col h-[calc(100vh-150px)]">
      <div className="flex">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="bg-amber-100 text-xl font-semibold flex-1"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <select
          className="mr-2 rounded px-2 py-1 bg-amber-100"
          value={selectedCategoryNo}
          key={selectedCategoryNo}
          onChange={(e) => {
            const selected = e.target.value;
            if (selected === "-2") {
              setShowCategoryPopup(true);
            } else {
              setSelectedCategoryNo(Number(selected));
            }
          }}
        >
          {/* <option value="add">➕ 추가</option> */}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {showCategoryPopup && (
          <div>
            <CategoryPopup
              onCancel={(data) => {
                if (data) {
                  refetch();
                }
                return setShowCategoryPopup(false);
              }}
            />
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-20"
              onClick={() => setShowCategoryPopup(false)}
            />
          </div>
        )}

        <button
          className="bg-green-400 rounded-md py-1 px-2 hover:bg-gray-500 duration-100"
          disabled={isPending}
          onClick={() => {
            mutate(
              {
                noteNo: initialData?.noteNo ?? null,
                title,
                thumnail: null,
                categoryNo:
                  selectedCategoryNo === -1 ? null : selectedCategoryNo,
                sortOrder: initialData?.sortOrder ?? null,
                content,
              },
              {
                onSuccess: () => {
                  alert("✅ 저장 완료!");
                  refetchNote();
                },
              }
            );
          }}
        >
          {isPending ? "저장중" : "저장"}
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        onClick={() => editor.chain().focus()}
      >
        <Editor onEditorReady={setEditor} content={content} />
      </div>
      <NoteToolbar editor={editor} />
    </div>
  );
}
