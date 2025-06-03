"use client";
import { useNoteLists } from "@app/notes/hooks/useNoteLists";
import Link from "next/link";
import NoteCard from "./NoteCard";
import Masonry from "react-masonry-css";
import { useEffect, useRef } from "react";
import { useSearchStore } from "@/store/useSearchStore";

export default function NoteLists() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNoteLists();
  const observerRef = useRef(null); //div태그를 연결해줄 ref객체
  // 검색 엔진 만들자.
  const { keyword } = useSearchStore();
  useEffect(() => {
    //다음 페이지가 없거나 이미 불러들이는 중이라면 감지할 필요 없음.
    if (!hasNextPage || isFetchingNextPage) return;
    //IntersectionObserver 는 화면에 어떤 요소가 보이는지 감지하는 기능
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 } //100% 화면에 보여야 작동하도록함(0~1값)
    );
    if (observerRef.current) {
      observer.observe(observerRef.current); // ✅ 관찰 시작!
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current); // ✅ cleanup: 관찰 해제
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, keyword]);

  if (isLoading) return <p>메모를 불러오는 중입니다...</p>;
  if (isError) {
    const message = error?.response?.data ?? "알 수 없는 오류";

    return <p>{message}</p>;
  }
  if (!data || data.pages[0].notes.length === 0)
    return (
      <div>
        <p>아직 작성된 메모가 없습니다.</p>
        <AddButton />
      </div>
    );

  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    640: 2,
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj} // 👈 반응형 컬럼 설정 적용
        className="flex gap-4" // Masonry 외부 스타일 (간격 등)
        columnClassName="space-y-4" // Masonry 내부 컬럼 스타일 (카드 사이 간격)
      >
        {/* {data.map((note) => (
          // 📌 노트 하나하나를 카드 형태로 렌더링
          <NoteCard key={note.noteNo} note={note} />
        ))} */}
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
      <AddButton />
    </div>
  );
}

export function AddButton() {
  return (
    <Link
      href={"/notes/write"}
      className="fixed right-4 bottom-4 h-12 w-12 z-40 rounded-xl flex items-center justify-center bg-gray-800 text-white font-bold text-2xl shadow-md"
    >
      +
    </Link>
  );
}
