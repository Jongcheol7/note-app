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
import { HtmlToPlainText } from "@/components/common/HtmlToPlainText";
import ColorPopup from "./ColorPopoup";
import { ColorStore } from "@/store/ColorStore";
import { usePublicMutation } from "../hooks/usePublicMutation";

export default function NoteDetail({ initialData, refetchNote }) {
  console.log("이니셜데이터 : ", initialData);

  // useState
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [selectedCategoryNo, setSelectedCategoryNo] = useState(
    initialData?.categoryNo ?? -1
  );
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [categories, setCategories] = useState([
    { id: -2, name: "➕ 추가" },
    { id: -1, name: "분류되지 않음" },
  ]);
  const [buttonAction, setButtonAction] = useState(false);
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false);

  // Router
  const router = useRouter();

  // useRef
  const buttonRef = useRef();

  // React Query
  const { mutate: saveMutate, isPending: isSaving } = useNoteMutation();
  const { mutate: deleteMutate, isPending: isDeleting } =
    useNoteDeleteMutation();
  const { mutate: revocerMutate, isPending: isRecovering } = useTrashRecovery();
  const { mutate: trashDeleteMutate, isPending: isTrashDeleting } =
    useTrashDelete();
  const { data: categoryData, refetch } = useCategoryLists();
  const { mutate: publicMutate, isPending: isPublicing } = usePublicMutation();

  // Zustand
  const { color, setColor } = ColorStore();

  useEffect(() => {
    if (initialData?.color) {
      setColor(initialData.color);
    }
  }, [initialData, setColor]);
  const bgStyle = { backgroundColor: color };

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
    <div
      className="relative flex flex-col h-[calc(100vh-150px)] px-2 rounded-md"
      style={bgStyle}
    >
      <div className="flex">
        <div className="flex justify-between items-center flex-1">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="bg-amber-100 text-xl font-semibold flex-1"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            style={bgStyle}
          />
          <div className="flex">
            <select
              className=""
              style={bgStyle}
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
            <button
              className=""
              onClick={() => setButtonAction((prev) => !prev)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 114.001-.001A2 2 0 016 10zm4 0a2 2 0 114.001-.001A2 2 0 0110 10zm4 0a2 2 0 114.001-.001A2 2 0 0114 10z" />
              </svg>
            </button>
          </div>
        </div>
        {/* 카테고리 팝업 */}
        <CategoryPopup
          setShow={setShowCategoryPopup}
          show={showCategoryPopup}
          refetch={refetch}
        />
        {/* 컬러 팝업 */}
        <ColorPopup
          setShow={setShowColorPopup}
          show={showColorPopup}
          refetch={refetchNote}
          noteNo={initialData?.noteNo}
        />

        {buttonAction && !initialData?.delDatetime && (
          <div
            className="absolute right-0 top-5 w-26 py-1 pt-2 bg-gray-200 dark:bg-gray-700  rounded-xl shadow-lg z-20 text-sm"
            ref={buttonRef}
          >
            <div className="flex items-center px-4 py-1">
              <span>배경색</span>
              <button
                className="w-5 h-5 ml-2 rounded-full"
                style={{
                  background: "conic-gradient(red, yellow, green, violet)",
                }}
                onClick={() => {
                  setShowColorPopup((prev) => !prev);
                  setButtonAction((prev) => !prev);
                }}
              />
            </div>
            <div className="flex items-center px-4 py-1">
              <span>{isPublic ? "공개" : "비공개"}</span>
              <button
                className={`relative ml-2 inline-flex items-center h-5 w-10 rounded-full transition-colors duration-300 ${
                  isPublic ? "bg-green-400" : "bg-gray-500"
                }`}
                onClick={() => {
                  publicMutate({
                    isPublic: !isPublic,
                    noteNo: initialData?.noteNo,
                  });
                  setIsPublic((prev) => !prev);
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform bg-white rounded-full ${
                    isPublic ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="flex justify-between px-4 py-1">
              <button
                className="hover:font-bold"
                disabled={isSaving}
                onClick={() => {
                  saveMutate(
                    {
                      noteNo: initialData?.noteNo,
                      title,
                      thumnail: null,
                      categoryNo:
                        selectedCategoryNo === -1 ? null : selectedCategoryNo,
                      sortOrder: initialData?.sortOrder ?? null,
                      content: editor.getHTML(),
                      plainText: HtmlToPlainText(editor.getHTML()),
                    },
                    {
                      onSuccess: () => {
                        alert("✅ 저장 완료!");
                        refetchNote();
                        router.push("/");
                      },
                    }
                  );
                }}
              >
                {isSaving ? "저장중" : "저장"}
              </button>
              <button
                className="hover:font-bold text-red-500"
                disabled={isDeleting}
                onClick={() => {
                  deleteMutate(
                    {
                      noteNo: initialData?.noteNo,
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
          </div>
        )}
        {buttonAction && initialData?.delDatetime && (
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
        <Editor
          onEditorReady={setEditor}
          content={initialData?.content ?? ""}
        />
      </div>
      <NoteToolbar editor={editor} />
    </div>
  );
}
