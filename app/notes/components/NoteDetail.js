"use client";
import Editor from "@app/notes/components/Editor";
import NoteToolbar from "@app/notes/components/NoteToolbar";
import { useNoteMutation } from "@app/notes/hooks/useNoteMutation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNoteDeleteMutation } from "../hooks/useNoteDeleteMutation";
import { useTrashRecovery } from "../hooks/useTrashRecovery";
import { useTrashDelete } from "../hooks/useTrashDeleteMutation";
import { HtmlToPlainText } from "@/components/common/HtmlToPlainText";
import ColorPopup from "./ColorPopoup";
import { usePublicMutation } from "../hooks/usePublicMutation";
import { CalendarDays, Heart, Lock, Unlock } from "lucide-react";
import { useLikeMutation } from "@/app/community/hooks/useLikeMutation";
import { useFromStore } from "@/store/useFromStore";
import { useColorStore } from "@/store/useColorStore";
import { useSecretMutation } from "../hooks/useSecretMutation";
import CalenderPopup from "@/app/calendar/components/CalenderPopup";
import CategoryPopup from "@/app/category/components/CategoryPopup";
import { useCategoryLists } from "@/app/category/hooks/useCategoryLists";
import { useNoteForm } from "../hooks/useNoteForm";

export default function NoteDetail({ initialData, refetchNote }) {
  console.log("이니셜데이터 : ", initialData);
  const noteNo = initialData?.noteNo;
  // useState
  const [editor, setEditor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [buttonAction, setButtonAction] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const {
    title,
    setTitle,
    selectedCategoryNo,
    setSelectedCategoryNo,
    selectedColor,
    setSelectedColor,
    alarmDatetime,
    setAlarmDatetime,
    isPublic,
    togglePublic,
    isSecret,
    toggleSecret,
    isLike,
    toggleLike,
  } = useNoteForm(initialData);
  const likeCnt = initialData?._count.likes;

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
  const { mutate: publicMutate } = usePublicMutation();
  const { mutate: likeMutate } = useLikeMutation();
  const { mutate: secretMutate } = useSecretMutation();

  // Zustand
  const { menuFrom: menu } = useFromStore();
  const bgStyle = { backgroundColor: selectedColor };

  // 카테고리 데이터를 가져오자
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

  console.log("카테고리 ! : ", categories);

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
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="bg-amber-100 text-xl font-semibold flex-1"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          style={bgStyle}
          readOnly={menu === "community"}
        />
        <div className="flex">
          <select
            className=""
            style={bgStyle}
            disabled={menu === "community"}
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button className="" onClick={() => setButtonAction((prev) => !prev)}>
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
        noteNo={noteNo}
        setSelectedColor={setSelectedColor}
      />
      {/* 달력 팝업 */}
      <CalenderPopup
        setShow={setShowCalendar}
        show={showCalendar}
        alarmDatetime={alarmDatetime}
        noteNo={noteNo}
        setAlarmDatetime={setAlarmDatetime}
      />

      {buttonAction && !initialData?.delDatetime && (
        <div
          className="absolute right-0 top-5 w-36 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-20 text-sm space-y-1"
          ref={buttonRef}
        >
          {/* 알림 설정 */}
          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
          >
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <span className="text-gray-800 dark:text-gray-200">알림 설정</span>
          </button>

          {/* 비밀글 */}
          {menu !== "community" && (
            <button
              onClick={() => {
                if (!noteNo) {
                  //새글일때는 저장할때 저장되도록 한다.
                  toggleSecret();
                } else {
                  //수정글일때는 누르면 즉각 변경되도록 한다.
                  secretMutate(
                    { noteNo: noteNo },
                    {
                      onSuccess: () => toggleSecret(),
                      onError: () => alert("비밀글 설정 실패"),
                    }
                  );
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
            >
              {isSecret ? (
                <Lock className="w-5 h-5 text-red-500" />
              ) : (
                <Unlock className="w-5 h-5 text-green-500" />
              )}
              <span className="text-gray-800 dark:text-gray-200">
                {isSecret ? "비밀글 해제" : "비밀글 설정"}
              </span>
            </button>
          )}

          {/* 좋아요 */}
          {initialData && (
            <button
              onClick={() => {
                likeMutate(
                  { isLike: !isLike, noteNo: noteNo },
                  {
                    onSuccess: () => toggleLike(),
                    onError: () => alert("좋아요 실패"),
                  }
                );
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLike
                    ? "fill-red-500 text-red-500"
                    : "fill-none text-gray-600"
                }`}
              />
              <span className="text-gray-800 dark:text-gray-200">
                좋아요 {likeCnt ? `x${likeCnt}` : ""}
              </span>
            </button>
          )}

          {/* 배경색 */}
          {menu !== "community" && (
            <button
              onClick={() => {
                setShowColorPopup((prev) => !prev);
                setButtonAction(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
            >
              <div
                className="w-5 h-5 rounded-full border"
                style={{
                  background: "conic-gradient(red, yellow, green, violet)",
                }}
              />
              <span className="text-gray-800 dark:text-gray-200">
                배경색 선택
              </span>
            </button>
          )}

          {/* 공개/비공개 */}
          {menu !== "community" && (
            <button
              onClick={() => {
                if (!noteNo) {
                  //새글일때는 저장할때 저장되도록 한다.
                  togglePublic();
                } else {
                  //수정글일때는 누르면 즉각 변경되도록 한다.
                  publicMutate(
                    {
                      isPublic: !isPublic,
                      noteNo: noteNo,
                    },
                    {
                      onSuccess: () => togglePublic(),
                      onError: () => alert("공개/비공개 설정 실패"),
                    }
                  );
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
            >
              <div
                className={`w-5 h-5 rounded-full ${
                  isPublic ? "bg-green-400" : "bg-gray-400"
                }`}
              />
              <span className="text-gray-800 dark:text-gray-200">
                {isPublic ? "공개 설정" : "공개 해제"}
              </span>
            </button>
          )}

          {/* 저장/삭제 */}
          {menu !== "community" && (
            <div className="flex justify-between items-center px-3 pt-2">
              <button
                className="text-sm text-blue-600 hover:font-bold"
                disabled={isSaving}
                onClick={() => {
                  saveMutate(
                    {
                      noteNo: noteNo,
                      title,
                      categoryNo:
                        selectedCategoryNo === -1 ? null : selectedCategoryNo,
                      sortOrder: initialData?.sortOrder ?? null,
                      content: editor.getHTML(),
                      plainText: HtmlToPlainText(editor.getHTML()),
                      color: selectedColor,
                      isSecret,
                      isPublic,
                      alarmDatetime,
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
                {isSaving ? "저장중" : "저장하기"}
              </button>
              <button
                className="text-sm text-red-500 hover:font-bold"
                disabled={isDeleting}
                onClick={() => {
                  deleteMutate(
                    { noteNo: noteNo },
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
                {isDeleting ? "삭제중" : "삭제하기"}
              </button>
            </div>
          )}
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
