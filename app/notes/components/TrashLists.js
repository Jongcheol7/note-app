"use client";
import Masonry from "react-masonry-css";
import { useTrashLists } from "../hooks/useTrashLists";
import NoteCard from "./NoteCard";

export default function TrashLists() {
  const { data, isLoading, isError, error } = useTrashLists();
  if (isLoading) return <p>메모를 불러오는 중입니다...</p>;
  if (isError)
    return <p>에러가 발생했습니다... {error?.message ?? "알 수 없는 오류"}</p>;
  if (!data || data.length === 0) return <p>휴지통이 비었습니다.</p>;

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="space-y-4"
      >
        {data.map((note) => (
          <NoteCard key={note.noteNo} note={note} />
        ))}
      </Masonry>
    </div>
  );
}
