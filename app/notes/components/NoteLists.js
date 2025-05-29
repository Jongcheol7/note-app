"use client";
import { useNoteLists } from "@app/notes/hooks/useNoteLists";
import Link from "next/link";

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

  return (
    <div>
      <div className="p-4 space-y-3">
        {data.map((note) => (
          <div
            key={note.noteNo}
            className="p-4 bg-white rounded shadow border border-gray-100"
          >
            <h2 className="text-lg font-bold">{note.title}</h2>
          </div>
        ))}
      </div>
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
