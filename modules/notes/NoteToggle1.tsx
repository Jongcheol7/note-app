import { CalendarDays, Heart, Lock, Save, Trash, Unlock, Globe, GlobeLock, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFromStore } from "@/store/useFromStore";
import { useNoteFormStore } from "@/store/useNoteFormStore";

import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { toast } from "sonner";
import { usePublicMutation } from "@/hooks/notes/usePublicMutation";
import { useNoteMutation } from "@/hooks/notes/useNoteMutation";
import { useNoteDeleteMutation } from "@/hooks/notes/useNoteDeleteMutation";
import { useSecretMutation } from "@/hooks/notes/useSecretMutation";
import ColorPopup from "../common/ColorPopoup";
import CalenderPopup from "../calendar/CalenderPopup";
import { HtmlToPlainText } from "@/components/common/HtmlToPlainText";
import { useLikeMutation } from "@/hooks/notes/useLikeMutation";
import { MENU } from "@/lib/constants";
import Popup from "@/components/common/Popup";

interface NoteToggle1Props {
  setButtonAction: (v: boolean) => void;
  initialData?: Record<string, unknown> & { _count: { likes: number }; sortOrder: number };
  refetchNote?: () => void;
  editor: ReturnType<typeof import("@tiptap/react").useEditor>;
}

export default function NoteToggle1({
  setButtonAction,
  initialData,
  refetchNote,
  editor,
}: NoteToggle1Props) {
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  const { mutate: saveMutate, isPending: isSaving } = useNoteMutation();
  const { mutate: deleteMutate, isPending: isDeleting } = useNoteDeleteMutation();
  const { mutate: publicMutate } = usePublicMutation();
  const { mutate: likeMutate } = useLikeMutation();
  const { mutate: secretMutate } = useSecretMutation();

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
    setIslike,
    isSecret,
    setIsSecret,
  } = useNoteFormStore();
  const { menuFrom: menu } = useFromStore();

  const menuItems = [
    menu !== MENU.COMMUNITY && {
      icon: CalendarDays,
      label: "알림 설정",
      color: "text-blue-500",
      onClick: () => setShowCalendarPopup(!showCalendarPopup),
    },
    menu !== MENU.COMMUNITY && {
      icon: isSecret ? Lock : Unlock,
      label: isSecret ? "비밀글 해제" : "비밀글 설정",
      color: isSecret ? "text-red-500" : "text-green-500",
      onClick: () => {
        if (isPublic && !isSecret) {
          toast.error("커뮤니티 등록을 해제하십시오.");
          return;
        }
        if (!noteNo) {
          setIsSecret(!isSecret);
        } else {
          secretMutate(
            { noteNo },
            {
              onSuccess: () => {
                setIsSecret(!isSecret);
                toast.success(isSecret ? "비밀글 설정 해제완료" : "비밀글 설정 완료");
              },
              onError: () => toast.error("비밀글 설정 실패"),
            }
          );
        }
      },
    },
    initialData && {
      icon: Heart,
      label: `좋아요 ${likeCnt ? `x${likeCnt}` : ""}`,
      color: "text-accent",
      iconClass: "fill-accent",
      onClick: () => {
        likeMutate(
          { isLike: !isLike, noteNo },
          {
            onSuccess: () => {
              setIslike(!isLike);
              toast.success(isLike ? "좋아요 해제" : "좋아요 추가");
            },
            onError: () => toast.error("좋아요 실패"),
          }
        );
      },
    },
    menu !== MENU.COMMUNITY && {
      icon: Palette,
      label: "배경색 선택",
      color: "text-purple-500",
      onClick: () => setShowColorPopup(!showColorPopup),
    },
    menu !== MENU.COMMUNITY && {
      icon: isPublic ? GlobeLock : Globe,
      label: isPublic ? "커뮤니티 해제" : "커뮤니티 등록",
      color: isPublic ? "text-green-500" : "text-muted-foreground",
      onClick: () => {
        if (isSecret && !isPublic) {
          toast.error("비밀글 설정을 해제하십시오.");
          return;
        }
        if (!noteNo) {
          setIsPublic(!isPublic);
        } else {
          publicMutate(
            { isPublic: !isPublic, noteNo },
            {
              onSuccess: () => {
                setIsPublic(!isPublic);
                toast.success(isPublic ? "해제완료" : "등록완료");
              },
              onError: () => toast.error("커뮤니티 등록/해제 실패"),
            }
          );
        }
      },
    },
    menu !== MENU.COMMUNITY && {
      icon: Save,
      label: isSaving ? "저장중..." : "저장하기",
      color: "text-primary",
      disabled: isSaving,
      onClick: async () => {
        try {
          const html = editor.getHTML();
          const matches = [
            ...html.matchAll(/<img[^>]+src="(data:image\/[^"]+)"[^>]*>/g),
          ];
          let uploadHTML = html;

          for (let i = 0; i < matches.length; i++) {
            const fullTag = matches[i][0];
            const base64 = matches[i][1];
            const res = await fetch(base64);
            const blob = await res.blob();
            const file = new File([blob], `image${i}.jpeg`, { type: blob.type });
            const compressedFile = await imageCompression(file, {
              maxSizeMB: 0.7,
              maxWidthOrHeight: 1024,
              useWebWorker: true,
            });
            const { data } = await axios.post("/api/notes/upload/image", {
              fileType: compressedFile.type,
            });
            if (data.error) throw new Error("Presigned URL 생성 실패");
            const { uploadUrl, fileUrl } = data;
            const styleMatch = fullTag.match(/style="([^"]*)"/);
            const styleAttr = styleMatch ? ` style="${styleMatch[1]}"` : "";
            await axios.put(uploadUrl, compressedFile, {
              headers: { "Content-Type": compressedFile.type },
            });
            const s3ImgTag = `<img src="${fileUrl}"${styleAttr} />`;
            uploadHTML = uploadHTML.replace(fullTag, s3ImgTag);
          }

          saveMutate(
            {
              noteNo,
              title,
              categoryNo: selectedCategoryNo === -1 ? null : selectedCategoryNo,
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
                refetchNote?.();
                router.push("/");
              },
              onError: () => toast.error("저장에 실패했습니다."),
            }
          );
        } catch (err) {
          toast.error("이미지 업로드에 실패했습니다.");
        }
      },
    },
    menu !== MENU.COMMUNITY && {
      icon: Trash,
      label: isDeleting ? "삭제중..." : "삭제하기",
      color: "text-destructive",
      disabled: isDeleting,
      onClick: () => {
        deleteMutate(
          { noteNo },
          {
            onSuccess: () => {
              toast.success("삭제 완료");
              refetchNote?.();
              router.push("/");
            },
            onError: () => toast.error("삭제에 실패했습니다."),
          }
        );
      },
    },
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
    iconClass?: string;
    disabled?: boolean;
    onClick: () => void;
  }>;

  return (
    <>
      <Popup onClose={() => setButtonAction(false)} bottomSheet>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                disabled={item.disabled}
                className="btn-menu-item"
              >
                <Icon className={`w-5 h-5 ${item.iconClass ?? item.color}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </Popup>

      {showColorPopup && (
        <ColorPopup
          setShow={setShowColorPopup}
          noteNo={noteNo}
          setSelectedColor={setSelectedColor}
          setButtonAction={setButtonAction}
        />
      )}

      {showCalendarPopup && (
        <CalenderPopup
          setShow={setShowCalendarPopup}
          setButtonAction={setButtonAction}
        />
      )}
    </>
  );
}
