"use client";
import DOMPurify from "dompurify"; // 🛡️ XSS 공격을 막기 위한 라이브러리
import { useRouter } from "next/navigation";

export default function NoteCard({ note }) {
  const safeHTML = DOMPurify.sanitize(note.content);
  const formattedDate = new Date(note.inputDatetime).toLocaleDateString();
  const router = useRouter();
  return (
    <div
      className="bg-red-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-all break-words"
      onClick={() => {
        router.push(`/notes/${note.noteNo}`);
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
        <span className="text-xs text-blue-600">...더보기</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
