"use client";
import { useEffect, useMemo, useRef } from "react";
import { useSearchStore } from "@/store/useSearchStore";
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
  const keyword = useSearchStore((s) => s.keyword);
  const menuFrom = useFromStore((s) => s.menuFrom);
  const categoryName = useCategoryStore((s) => s.categoryName);

  const {
    data,
    error,
    isError,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNoteLists({ menuFrom, keyword, categoryName });

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
      { threshold: 0.1 }
    );
    const target = observerRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isInitialLoading = isFetching && !data;
  if (isInitialLoading)
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (isError) {
    const axiosErr = error as { response?: { status?: number; data?: { error?: string } } };
    const status = axiosErr?.response?.status;
    const message = axiosErr?.response?.data?.error;
    if (status === 401) {
      toast.error("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      signIn("google");
    } else {
      toast.error(`에러 발생: ${message}`);
    }
  }

  return (
    <div className="pt-1">
      <MainCategory />

      {allNotes.length === 0 && !isFetching && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-base font-medium">메모가 없습니다</p>
          <p className="text-sm mt-1">새로운 메모를 작성해보세요</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 pb-4">
        {allNotes.map((note) => (
          <NoteCard key={note.noteNo} note={note} />
        ))}
      </div>

      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
