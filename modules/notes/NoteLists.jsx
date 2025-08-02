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
import { useCategoryLists } from "@/hooks/category/useCategoryLists";
import { useCategoryStore } from "@/store/useCategoryStore";

export default function NoteLists() {
  const observerRef = useRef(null);
  const queryClient = useQueryClient();
  const { keyword } = useSearchStore();

  const { menuFrom } = useFromStore();
  const { categoryName, setCategoryName } = useCategoryStore();
  console.log("menufrom : ", menuFrom);

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

  const { data: categoryData } = useCategoryLists();

  console.log("카테고리 조회해보자 dd : ", categoryData);

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
    console.log("error :", error);
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
      {/* 카테고리 */}
      <div className="flex gap-3 pb-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          key="all"
          onClick={() => setCategoryName("")}
          className={`px-3 py-1 rounded-full shrink-0 border transition ${
            categoryName === ""
              ? "bg-gray-500 text-white border-gray-500 font-semibold"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          }`}
        >
          전체
        </button>
        {categoryData &&
          categoryData.map((cat) => (
            <button
              key={cat.categoryNo}
              className={`bg-white px-2 py-1 rounded-full shrink-0 ${
                categoryName === cat.name
                  ? "bg-gray-500 text-white border-gray-500 font-semibold"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={(e) => {
                setCategoryName(cat.name);
              }}
            >
              {cat.name}
            </button>
          ))}
      </div>
      <div className="overflow-y-auto scrollbar-none grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        {allNotes.map((note) => (
          <NoteCard key={note.noteNo} note={note} />
        ))}
        <div ref={observerRef} className="h-20" />
        {isFetchingNextPage && <p>📦 다음 메모 불러오는 중...</p>}
        <AddButton />
      </div>
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
