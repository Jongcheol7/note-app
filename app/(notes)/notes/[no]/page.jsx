"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useFromStore } from "@/store/useFromStore";
import NoteDetail from "@/modules/notes/NoteDetail";
import { useNoteDetail } from "@/hooks/notes/useNoteDetail";
import { Inbox } from "lucide-react";

export default function NoteDetailPage() {
  const { no } = useParams();
  const { menuFrom } = useFromStore();
  console.log("노트상세페이지 id :", no);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchNote,
  } = useNoteDetail(no, menuFrom);
  if (isError) {
    return <p>{error?.message ?? "알 수 없는 오류"}</p>;
  }
  if (!data || data.length === 0) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-gray-500">
        <Inbox className="w-10 h-10 mb-2 opacity-60" />
        <p className="text-sm">내용이 없습니다.</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  return <NoteDetail initialData={data} refetchNote={refetchNote} />;
}
