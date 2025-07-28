"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useFromStore } from "@/store/useFromStore";
import NoteDetail from "@/modules/notes/NoteDetail";
import { useNoteDetail } from "@/hooks/notes/useNoteDetail";

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
    return <p>내용이 없습니다.</p>;
  }
  if (isLoading) {
    return <p>내용을 불러오는 중입니다.</p>;
  }

  return <NoteDetail initialData={data} refetchNote={refetchNote} />;
}
