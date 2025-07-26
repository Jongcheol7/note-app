"use client";
import { useEffect, useMemo, useRef } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useQueryClient } from "@tanstack/react-query";
import NoteCard from "./NoteCard";
import Link from "next/link";
import { useNoteLists } from "../hooks/useNoteLists";

export default function NoteLists() {
  const observerRef = useRef(null);
  const queryClient = useQueryClient();
  const { keyword } = useSearchStore();

  const {
    data,
    error,
    isError,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useNoteLists();

  // ✅ keyword가 바뀌면 기존 noteLists 데이터를 리셋
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["noteLists"] });
    refetch(); // 새로운 검색어로 refetch
  }, [keyword, queryClient, refetch]);

  const allNotes = useMemo(() => {
    return data?.pages.flatMap((page) => page.notes) ?? [];
  }, [data]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const target = observerRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isFetching && !isFetchingNextPage) return <p>메모를 불러오는 중...</p>;
  if (isError) {
    const message = error?.response?.data ?? "알 수 없는 오류";
    return <p>{message}</p>;
  }

  return (
    <div className="overflow-y-auto scrollbar-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
      {allNotes.map((note) => (
        <NoteCard key={note.noteNo} note={note} />
      ))}
      <div ref={observerRef} className="h-20" />
      {isFetchingNextPage && <p>📦 다음 메모 불러오는 중...</p>}
      <AddButton />
    </div>
  );
}

function AddButton() {
  return (
    <Link
      href="/notes/write"
      className="fixed right-4 bottom-4 h-12 w-12 z-40 rounded-xl flex items-center justify-center bg-gray-800 text-white text-2xl font-bold shadow-md"
    >
      +
    </Link>
  );
}
