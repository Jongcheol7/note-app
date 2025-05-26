"use client";
import { useNoteLists } from "@/store/useNoteLists";
import Link from "next/link";

export default function NoteLists() {
  const { data, isLoading, isError, error } = useNoteLists();
  if (isLoading) return <p>메모를 불러오는 중입니다...</p>;
  if (isError) console.log("🔥 에러 내용:", error); // ← axios or fetch가 어떤 에러 받았는지 확인

  if (!data || data.length === 0) return <p>아직 작성된 메모가 없습니다.</p>;

  return (
    <div>
      <div className="p-4 space-y-3">
        {data.map((note) => (
          <div
            key={note.note_no}
            className="p-4 bg-white rounded shadow border border-gray-100"
          >
            <h2 className="text-lg font-bold">{note.title}</h2>
          </div>
        ))}
      </div>
      <Link
        href={"/note/note-write"}
        className="absolute right-4 bottom-4 h-12 w-12 z-40 rounded-xl flex items-center justify-center bg-gray-800 text-white font-bold text-2xl shadow-md"
      >
        +
      </Link>
    </div>
  );
}
