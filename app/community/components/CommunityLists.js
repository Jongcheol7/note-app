"use client";
import Masonry from "react-masonry-css";
import { useCommunityLists } from "../hooks/useCommunityLists";
import { useSearchStore } from "@/store/SearchStore";
import { useEffect, useRef } from "react";
import NoteCard from "@/app/notes/components/NoteCard";

export default function CommunityLists() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityLists();
  const observerRef = useRef(null);
  const { keyword } = useSearchStore();

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, keyword]);
  if (isLoading) return <p>메모를 불러오는 중입니다...</p>;
  if (isError)
    return (
      <p>에러가 발생했습니다... : {error?.message ?? "알 수 없는 오류"}</p>
    );
  if (!data || data.pages[0].notes.length === 0)
    return <p>아직 작성된 메모가 없습니다.</p>;

  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    640: 2,
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
      {isFetchingNextPage && <p>📦 다음 메모를 불러오는 중...</p>}{" "}
      <div ref={observerRef} className="h-10" />{" "}
    </div>
  );
}
