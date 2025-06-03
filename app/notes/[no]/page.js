"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useNoteDetail } from "../hooks/useNoteDetail";
import NoteDetail from "../components/NoteDetail";

export default function NoteDetailPage() {
  const { no } = useParams();
  console.log("노트상세페이지 id :", no);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchNote,
  } = useNoteDetail(no);
  if (isError) {
    return (
      <p>에러가 발생했습니다... : {error?.message ?? "알 수 없는 오류"}</p>
    );
  }
  if (!data || data.length === 0) {
    return <p>내용이 없습니다.</p>;
  }
  if (isLoading) {
    return <p>내용을 불러오는 중입니다.</p>;
  }

  return <NoteDetail initialData={data} refetchNote={refetchNote} />;
}
