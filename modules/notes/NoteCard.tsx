"use client";
import { memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, Pin } from "lucide-react";
import { usePinMutation } from "@/hooks/notes/usePinMutation";
import { useFromStore } from "@/store/useFromStore";
import { MENU } from "@/lib/constants";

interface NoteCardProps {
  note: {
    noteNo: number;
    title: string;
    content: string;
    plainText: string;
    modDatetime: string;
    color: string | null;
    isPinned: boolean;
    isPublic: boolean;
    _count: { likes: number };
    likes: { userId: string }[];
  };
}

export default memo(function NoteCard({ note }: NoteCardProps) {
  const plainText = useMemo(() => {
    // plainText가 있으면 사용, 없으면 HTML에서 텍스트 추출
    if (note.plainText) return note.plainText;
    if (typeof window !== "undefined") {
      const div = document.createElement("div");
      div.innerHTML = note.content;
      return div.textContent || "";
    }
    return "";
  }, [note.plainText, note.content]);

  const formattedDate = useMemo(
    () =>
      new Date(note.modDatetime).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
    [note.modDatetime]
  );
  const { mutate: pinMutate, isPending: isPinning } = usePinMutation();
  const menuFrom = useFromStore((s) => s.menuFrom);
  const router = useRouter();

  const handlePin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      pinMutate({ isPinned: !note.isPinned, noteNo: note.noteNo });
    },
    [pinMutate, note.isPinned, note.noteNo]
  );

  const handleClick = useCallback(() => {
    router.push(`/notes/${note.noteNo}`);
  }, [router, note.noteNo]);

  const hasColor = note.color && note.color !== "#FEF3C7" && note.color !== "#fef3c7";

  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-border/60 hover:border-border transition-all duration-200 overflow-hidden active:scale-[0.98] cursor-pointer bg-card"
      style={hasColor ? { backgroundColor: note.color! } : undefined}
      onClick={handleClick}
    >
      <div className="p-3.5 pb-2">
        {note.title && (
          <h3 className="font-semibold text-[13px] mb-1 line-clamp-1 text-foreground">
            {note.title}
          </h3>
        )}
        <p className="text-xs text-foreground/60 line-clamp-4 leading-relaxed whitespace-pre-line">
          {plainText}
        </p>
      </div>

      <div className="flex items-center justify-between px-3.5 py-2 text-[11px] text-muted-foreground">
        <span>{formattedDate}</span>
        <div className="flex items-center gap-1.5">
          {note._count.likes > 0 && (
            <div className="flex items-center gap-0.5">
              <Heart className="w-3 h-3 fill-accent text-accent" />
              <span className="text-accent font-medium">{note._count.likes}</span>
            </div>
          )}
          {menuFrom === MENU.HOME && (
            <button
              onClick={handlePin}
              disabled={isPinning}
              aria-label={note.isPinned ? "핀 해제" : "핀 고정"}
              className="p-0.5 rounded-full transition-colors hover:bg-black/5"
            >
              <Pin
                className={`w-3 h-3 transition-colors ${
                  note.isPinned
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );
});
