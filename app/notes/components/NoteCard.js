"use client";
import DOMPurify from "dompurify"; // 🛡️ XSS 공격을 막기 위한 라이브러리
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function NoteCard({ note }) {
  const safeHTML = DOMPurify.sanitize(note.content);
  const formattedDate = new Date(note.inputDatetime).toLocaleDateString();
  const router = useRouter();

  return (
    <div
      className="p-4 rounded-xl shadow-md hover:shadow-lg transition-all break-words"
      onClick={() => {
        router.push(`/notes/${note.noteNo}`);
      }}
      style={{
        backgroundColor: note.color ?? "#fef3c7", // note.color 값 사용, 없으면 기본 색
      }}
    >
      <div
        className="prose prose-sm max-w-none overflow-hidden line-clamp-none relative"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 10, // ✅ 원하는 줄 수로 제한
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          maxHeight: "300px", // ✅ 최대 높이 제한
        }}
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      />
      <div className="flex justify-between text-xs text-gray-500 text-right mt-2">
        <div className="flex gap-1 items-center">
          <Heart
            className={`w-4 h-4 ${
              note?.likes.length > 0 ? "fill-red-500" : "fill-none"
            }`}
          />
          <span>{note._count.likes}</span>
        </div>
        {/* <span className="text-xs text-blue-600">...더보기</span> */}
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
