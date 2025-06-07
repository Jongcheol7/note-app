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
import { usePublicMutation } from "../hooks/usePublicMutation";
import { CalendarDays, Heart, Lock, Unlock } from "lucide-react";
import { useLikeMutation } from "@/app/community/hooks/useLikeMutation";
import { useFromStore } from "@/store/useFromStore";
import { useColorStore } from "@/store/useColorStore";
import { useSecretMutation } from "../hooks/useSecretMutation";
import CalenderPopup from "@/app/calendar/components/CalenderPopup";

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
  const [isLike, setIsLike] = useState(initialData?.likes.length > 0 ?? false);
  const likeCnt = initialData?._count.likes;
  const [isSecret, setIsSecret] = useState(initialData?.isSecret ?? false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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
  const { mutate: likeMutate, isPending: isLiking } = useLikeMutation();
  const { mutate: secretMutate, isPending: isSecreting } = useSecretMutation();

  // Zustand
  const { color, setColor } = useColorStore();
  const { menuFrom: menu } = useFromStore();
  //console.log("menuFrom : ", menu);

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
            {/* <option value="add">➕ 추가</option> */}
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
        refetch={refetchNote}
        noteNo={initialData?.noteNo}
      />
      {/* 달력 팝업 */}
      <CalenderPopup
        setShow={setShowCalendar}
        show={showCalendar}
        selectedDate={initialData?.alarmDatetime}
        noteNo={initialData?.noteNo}
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
                secretMutate({ noteNo: initialData?.noteNo });
                setIsSecret((prev) => !prev);
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
          <button
            onClick={() => {
              likeMutate({ isLike: !isLike, noteNo: initialData?.noteNo });
              setIsLike((prev) => !prev);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
          >
            <Heart
              className={`w-5 h-5 ${
                isLike ? "fill-red-500 text-red-500" : "fill-none text-gray-600"
              }`}
            />
            <span className="text-gray-800 dark:text-gray-200">
              좋아요 {likeCnt ? `x${likeCnt}` : ""}
            </span>
          </button>

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
                publicMutate({
                  isPublic: !isPublic,
                  noteNo: initialData?.noteNo,
                });
                setIsPublic((prev) => !prev);
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
                      noteNo: initialData?.noteNo,
                      title,
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
                {isSaving ? "저장중" : "저장하기"}
              </button>
              <button
                className="text-sm text-red-500 hover:font-bold"
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
