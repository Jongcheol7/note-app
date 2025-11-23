"use client";
import { useEffect, useMemo, useRef } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import NoteCard from "./NoteCard";
import { useNoteLists } from "@/hooks/notes/useNoteLists";
import { useFromStore } from "@/store/useFromStore";
import MainCategory from "../category/MainCategory";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Loader2 } from "lucide-react";

export default function NoteLists() {
  const observerRef = useRef(null);
  const queryClient = useQueryClient();
  const { keyword } = useSearchStore();
  const { menuFrom } = useFromStore();
  const { categoryName } = useCategoryStore();

  const {
    data,
    error,
    isError,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useNoteLists({ menuFrom, keyword, categoryName });

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["noteLists"] });
    refetch();
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

  if (isFetching && !isFetchingNextPage)
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );

  if (isError) {
    const status = error?.response?.status;
    const message = error?.response?.data?.error;
    if (status === 401) {
      toast.error("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      signIn("google");
    } else {
      toast.error(`에러 발생: ${message}`);
    }
  }

  return (
    <div>
      <MainCategory />

      <div className="overflow-y-auto scrollbar-none grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        {allNotes.map((note) => (
          <NoteCard key={note.noteNo} note={note} />
        ))}
        <div ref={observerRef} className="h-20" />
        {isFetchingNextPage && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
          </div>
        )}

        <Link
          href="/notes/write"
          className="fixed right-4 bottom-4 h-12 w-12 z-40 rounded-xl flex items-center justify-center bg-gray-800 text-white text-2xl font-bold shadow-md"
        >
          +
        </Link>
      </div>
    </div>
  );
}
