"use client";
import Masonry from "react-masonry-css";
import { useTrashLists } from "../hooks/useTrashLists";
import NoteCard from "./NoteCard";
import { useEffect, useRef } from "react";

export default function TrashLists() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTrashLists();
  const observerRef = useRef(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
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
        {data.pages
          .flatMap((page) => page.notes)
          .map((note) => (
            <NoteCard key={note.noteNo} note={note} />
          ))}
      </Masonry>
      {isFetchingNextPage && <p>📦 다음 메모 불러오는 중...</p>}{" "}
      {/* ✅ 로딩 중이면 메시지 표시 */}
      <div ref={observerRef} className="h-10" />{" "}
      {/* ✅ 이 div가 화면에 보이면 다음 페이지 로딩 */}
    </div>
  );
}
