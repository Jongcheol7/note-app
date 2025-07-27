import { CalendarDays, Heart, Lock, Unlock } from "lucide-react";
import { useNoteMutation } from "../hooks/useNoteMutation";
import { useNoteDeleteMutation } from "../hooks/useNoteDeleteMutation";
import { usePublicMutation } from "../hooks/usePublicMutation";
import { useLikeMutation } from "@/app/community/hooks/useLikeMutation";
import { useSecretMutation } from "../hooks/useSecretMutation";
import { useEffect, useRef, useState } from "react";
import { useFromStore } from "@/store/useFromStore";
import ColorPopup from "./ColorPopoup";
import CalenderPopup from "@/app/calendar/components/CalenderPopup";
import { useNoteFormStore } from "@/store/useNoteFormStore";
import { HtmlToPlainText } from "@/components/common/HtmlToPlainText";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { toast } from "sonner";

export default function NoteToggle1({
  setButtonAction,
  initialData,
  refetchNote,
  editor,
}) {
  console.log("refetchNote : ", refetchNote);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  const { mutate: saveMutate, isPending: isSaving } = useNoteMutation();
  const { mutate: deleteMutate, isPending: isDeleting } =
    useNoteDeleteMutation();
  const { mutate: publicMutate } = usePublicMutation();
  const { mutate: likeMutate } = useLikeMutation();
  const { mutate: secretMutate } = useSecretMutation();

  const buttonRef = useRef();
  const likeCnt = initialData?._count.likes;
  const router = useRouter();

  const {
    noteNo,
    title,
    categoryNo,
    selectedCategoryNo,
    selectedColor,
    setSelectedColor,
    alarmDatetime,
    isPublic,
    setIsPublic,
    isLike,
    setIsLike,
    isSecret,
    setIsSecret,
  } = useNoteFormStore();
  const { menuFrom: menu } = useFromStore();

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
      className="absolute right-0 top-0 w-36 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-20 text-sm space-y-1"
      ref={buttonRef}
    >
      {/* 알림 설정 */}
      {menu !== "community" && (
        <button
          onClick={() => setShowCalendarPopup(!showCalendarPopup)}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
        >
          <CalendarDays className="w-5 h-5 text-blue-500" />
          <span className="text-gray-800 dark:text-gray-200">알림 설정</span>
        </button>
      )}

      {/* 비밀글 */}
      {menu !== "community" && (
        <button
          onClick={() => {
            if (!noteNo) {
              //새글일때는 저장할때 저장되도록 한다.
              setIsSecret(!isSecret);
            } else {
              //수정글일때는 누르면 즉각 변경되도록 한다.
              secretMutate(
                { noteNo: noteNo },
                {
                  onSuccess: () => setIsSecret(!isSecret),
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
                onSuccess: () => setIsLike(!isLike),
                onError: () => alert("좋아요 실패"),
              }
            );
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
      )}

      {/* 배경색 */}
      {menu !== "community" && (
        <button
          onClick={() => {
            setShowColorPopup(!showColorPopup);
          }}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
        >
          <div
            className="w-5 h-5 rounded-full border"
            style={{
              background: "conic-gradient(red, yellow, green, violet)",
            }}
          />
          <span className="text-gray-800 dark:text-gray-200">배경색 선택</span>
        </button>
      )}

      {/* 공개/비공개 */}
      {menu !== "community" && (
        <button
          onClick={() => {
            if (!noteNo) {
              //새글일때는 저장할때 저장되도록 한다.
              setIsPublic(!isPublic);
            } else {
              //수정글일때는 누르면 즉각 변경되도록 한다.
              publicMutate(
                {
                  isPublic: !isPublic,
                  noteNo: noteNo,
                },
                {
                  onSuccess: () => setIsPublic(!isPublic),
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
            onClick={async () => {
              const html = editor.getHTML();

              console.log("html: ", html);

              //base64 형태인 img 를 골라내자.
              const matches = [
                ...html.matchAll(/<img[^>]+src="(data:image\/[^"]+)"[^>]*>/g),
              ];

              let uploadHTML = html;

              for (let i = 0; i < matches.length; i++) {
                const fullTag = matches[i][0]; // 전체 <img ...> 태그
                const base64 = matches[i][1]; // src 안의 base64

                // base64 → blob -> File 변환
                const res = await fetch(base64);
                const blob = await res.blob();
                const file = new File([blob], `image${i}.jpeg`, {
                  type: blob.type,
                });

                // 압축
                const compressedFile = await imageCompression(file, {
                  maxSizeMB: 0.7,
                  maxWidthOrHeight: 1024,
                  useWebWorker: true,
                });

                // presigned URL 요청
                const { data } = await axios.post("/api/notes/upload/image", {
                  fileType: compressedFile.type,
                });

                if (data.error) {
                  throw new Error("Presigned URL 생성 실패");
                }

                const { uploadUrl, fileUrl } = data;

                //스타일 속성 유지하기
                const styleMatch = fullTag.match(/style="([^"]*)"/);
                const styleAttr = styleMatch ? ` style="${styleMatch[1]}"` : "";

                // S3에 업로드
                await axios.put(uploadUrl, compressedFile, {
                  headers: {
                    "Content-Type": compressedFile.type,
                  },
                });

                // base64 태그 → 실제 S3 URL로 바꾸기 (해당 <img> 전체 태그 교체)
                const s3ImgTag = `<img src="${fileUrl}"${styleAttr} />`;
                uploadHTML = uploadHTML.replace(fullTag, s3ImgTag);
              }

              //8. 노트 저장
              saveMutate(
                {
                  noteNo,
                  title,
                  categoryNo:
                    selectedCategoryNo === -1 ? null : selectedCategoryNo,
                  sortOrder: initialData?.sortOrder ?? null,
                  content: uploadHTML,
                  plainText: HtmlToPlainText(uploadHTML),
                  color: selectedColor,
                  isSecret,
                  isPublic,
                  alarmDatetime,
                },
                {
                  onSuccess: () => {
                    toast.success("저장 완료");
                    console.log("저장완료");
                    refetchNote();
                    console.log("리패치");
                    router.push("/");
                    console.log("홈으로이동");
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
                { noteNo },
                {
                  onSuccess: () => {
                    toast.success("삭제 완료");
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

      {/* 컬러 팝업 */}
      {showColorPopup && (
        <ColorPopup
          setShow={setShowColorPopup}
          noteNo={noteNo}
          setSelectedColor={setSelectedColor}
          setButtonAction={setButtonAction}
        />
      )}

      {/* 달력 팝업 */}
      {showCalendarPopup && <CalenderPopup setShow={setShowCalendarPopup} />}
    </div>
  );
}
