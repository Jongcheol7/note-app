"use client";
import { useParams } from "next/navigation";
import { useFromStore } from "@/store/useFromStore";
import NoteDetail from "@/modules/notes/NoteDetail";
import { useNoteDetail } from "@/hooks/notes/useNoteDetail";
import { Inbox, Loader2 } from "lucide-react";

export default function NoteDetailPage() {
  const { no } = useParams();
  const noteNo = no ? Number(no) : null;
  const { menuFrom } = useFromStore();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchNote,
  } = useNoteDetail(noteNo, menuFrom);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">{error?.message ?? "알 수 없는 오류"}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Inbox className="w-10 h-10 mb-2 opacity-40" />
        <p className="text-sm">내용이 없습니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <NoteDetail initialData={data} refetchNote={refetchNote} />;
}
