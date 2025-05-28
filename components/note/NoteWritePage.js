"use client";
import Editor from "@/components/note/Editor";
import NoteToolbar from "@/components/note/NoteToolbar";
import { useNoteMutation } from "@/store/useNoteMutation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryPopup from "./CategoryPopup";

export default function NoteWritePage() {
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { mutate, isPending } = useNoteMutation();
  const router = useRouter();
  const [categories, setCategories] = useState([
    { id: 0, name: "➕ 추가" },
    { id: 1, name: "분류되지 않음" },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

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
        />
        <select
          className="mr-2 rounded px-2 py-1 bg-amber-100"
          value={selectedCategoryId}
          key={selectedCategoryId}
          onChange={(e) => {
            const selected = e.target.value;
            if (selected === "add") {
              setShowCategoryPopup(true);
            } else {
              setSelectedCategoryId(selected);
            }
          }}
        >
          <option value="add">➕ 추가</option>
          {categories
            .filter((cat) => cat.id !== 0 && cat.id !== "add")
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        {showCategoryPopup && (
          <div>
            <CategoryPopup
              onCancel={() => setShowCategoryPopup(false)}
              onAdd={(newOne) => {
                const newCategory = {
                  id: categories.length + 1,
                  name: newOne,
                };
                setCategories([...categories, newCategory]);
                setSelectedCategoryId(newCategory.id);
                setShowCategoryPopup(false);
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
          onClick={() => {
            mutate(
              {
                title,
                thumnail: null,
                category_id: null,
                sort_order: 0,
                content,
              },
              {
                onSuccess: () => {
                  alert("✅ 저장 완료!");
                  router.push("/");
                },
              }
            );
          }}
        >
          저장
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        onClick={() => editor.chain().focus()}
      >
        <Editor onEditorReady={setEditor} />
      </div>
      <NoteToolbar editor={editor} />
    </div>
  );
}
