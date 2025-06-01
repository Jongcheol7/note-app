"use client";
import { useNoteLists } from "@app/notes/hooks/useNoteLists";
import Link from "next/link";
import NoteCard from "./NoteCard";
import Masonry from "react-masonry-css";

export default function NoteLists() {
  const { data, isLoading, isError, error } = useNoteLists();
  if (isLoading) return <p>메모를 불러오는 중입니다...</p>;
  if (isError)
    return (
      <p>에러가 발생했습니다... : {error?.message ?? "알 수 없는 오류"}</p>
    );
  if (!data || data.length === 0)
    return (
      <div>
        <p>아직 작성된 메모가 없습니다.</p>
        <AddButton />
      </div>
    );

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj} // 👈 반응형 컬럼 설정 적용
        className="flex gap-4" // Masonry 외부 스타일 (간격 등)
        columnClassName="space-y-4" // Masonry 내부 컬럼 스타일 (카드 사이 간격)
      >
        {data.map((note) => (
          // 📌 노트 하나하나를 카드 형태로 렌더링
          <NoteCard key={note.noteNo} note={note} />
        ))}
      </Masonry>
      <AddButton />
    </div>
  );
}

export function AddButton() {
  return (
    <Link
      href={"/notes/write"}
      className="absolute right-4 bottom-4 h-12 w-12 z-40 rounded-xl flex items-center justify-center bg-gray-800 text-white font-bold text-2xl shadow-md"
    >
      +
    </Link>
  );
}
