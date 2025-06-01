"use client";
import Editor from "@app/notes/components/Editor";
import NoteToolbar from "@app/notes/components/NoteToolbar";
import { useNoteMutation } from "@app/notes/hooks/useNoteMutation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CategoryPopup from "@app/notes/components/CategoryPopup";
import { useCategoryLists } from "../hooks/useCategoryLists";
import { useNoteDeleteMutation } from "../hooks/useNoteDeleteMutation";
import { useTrashRecovery } from "../hooks/useTrashRecovery";
import { useTrashDelete } from "../hooks/useTrashDeleteMutation";

export default function NoteDetail({ initialData, refetchNote }) {
  console.log("이니셜데이터 : ", initialData);
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const { mutate: saveMutate, isPending: isSaving } = useNoteMutation();
  const { mutate: deleteMutate, isPending: isDeleting } =
    useNoteDeleteMutation();
  const { mutate: revocerMutate, isPending: isRecovering } = useTrashRecovery();
  const { mutate: trashDeleteMutate, isPending: isTrashDeleting } =
    useTrashDelete();
  const router = useRouter();
  const [categories, setCategories] = useState([
    { id: -2, name: "➕ 추가" },
    { id: -1, name: "분류되지 않음" },
  ]);
  const [selectedCategoryNo, setSelectedCategoryNo] = useState(
    initialData?.categoryNo ?? -1
  );
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const buttonRef = useRef();
  const [buttonAction, setButtonAction] = useState(false);

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

  // 외부 클릭시 ... 토글 비활성화 하자.
  useEffect(() => {
    const hadleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setButtonAction(false);
      }
    };
    document.addEventListener("mousedown", hadleClickOutside);
    return () => {
      document.removeEventListener("mousedown", hadleClickOutside);
    };
  }, []);

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

        <button onClick={() => setButtonAction((prev) => !prev)}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 114.001-.001A2 2 0 016 10zm4 0a2 2 0 114.001-.001A2 2 0 0110 10zm4 0a2 2 0 114.001-.001A2 2 0 0114 10z" />
          </svg>
        </button>
        {buttonAction && !initialData.delDatetime && (
          <div
            className="absolute right-0 top-5 mt-2 w-24 bg-white dark:bg-gray-700 border border-gray-200 rounded-xl shadow-lg z-20 text-sm"
            ref={buttonRef}
          >
            <button
              className="block w-full text-left px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={isSaving}
              onClick={() => {
                saveMutate(
                  {
                    noteNo: initialData.noteNo,
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
                      setButtonAction(false);
                    },
                  }
                );
              }}
            >
              {isSaving ? "저장중" : "저장"}
            </button>
            <button
              className="block w-full text-left px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500"
              disabled={isDeleting}
              onClick={() => {
                deleteMutate(
                  {
                    noteNo: initialData.noteNo,
                  },
                  {
                    onSuccess: () => {
                      alert("삭제 완료!");
                      refetchNote();
                      router.push("/");
                    },
                  }
                );
              }}
            >
              {isDeleting ? "삭제중" : "삭제"}
            </button>
          </div>
        )}
        {buttonAction && initialData.delDatetime && (
          <div className="absolute right-0 top-5 mt-2  w-24 bg-white dark:bg-gray-700 border border-gray-200 rounded-xl shadow-lg z-20 text-sm">
            <button
              className="block w-full text-left px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={isRecovering}
              onClick={() => {
                revocerMutate(
                  { noteNo: initialData.noteNo },
                  {
                    onSuccess: () => {
                      alert("복원 완료!");
                      router.push("/notes/trash");
                    },
                  }
                );
              }}
            >
              복원
            </button>
            <button
              className="block w-full text-left px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={isTrashDeleting}
              onClick={() => {
                trashDeleteMutate(
                  { noteNo: initialData.noteNo },
                  {
                    onSuccess: () => {
                      alert("영구 삭제 완료!");
                      router.push("/notes/trash");
                    },
                  }
                );
              }}
            >
              영구삭제
            </button>
          </div>
        )}
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
