"use client";
import DOMPurify from "dompurify"; // 🛡️ XSS 공격을 막기 위한 라이브러리
import { useRouter } from "next/navigation";

export default function NoteCard({ note }) {
  const safeHTML = DOMPurify.sanitize(note.content);
  const formattedDate = new Date(note.inputDatetime).toLocaleDateString();
  const router = useRouter();
  console.log("note: ", note);
  return (
    <div
      className="bg-red-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-all break-words"
      onClick={() => {
        console.log("note.noteNo: ", note.noteNo);
        router.push(`/notes/${note.noteNo}`);
      }}
    >
      <div
        className="prose prose-sm max-w-none line-clamp-6 mb-2"
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      />
      <div className="text-xs text-gray-500 text-right mt-2">
        {formattedDate}
      </div>
    </div>
  );
}
