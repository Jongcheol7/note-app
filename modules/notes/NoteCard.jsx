"use client";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function NoteCard({ note }) {
  const safeHTML = DOMPurify.sanitize(note.content); //악성스크립트제거
  const formattedDate = new Date(note.modDatetime).toLocaleDateString();
  const router = useRouter();

  return (
    <div
      className="p-4 rounded-xl shadow-md hover:shadow-2xl transition-all break-words flex flex-col justify-between"
      onClick={() => {
        router.push(`/notes/${note.noteNo}`);
      }}
      style={{
        backgroundColor: note.color ?? "#fef3c7", // note.color 값 사용, 없으면 기본 색
      }}
    >
      <div
        className="max-w-none overflow-hidden h-[130px] lg:h-[230px] relative"
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
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
