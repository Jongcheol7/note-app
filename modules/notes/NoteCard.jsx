"use client";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

export default function NoteCard({ note }) {
  const safeHTML = DOMPurify.sanitize(note.content); //악성스크립트제거
  const formattedDate = new Date(note.modDatetime).toLocaleDateString();
  const router = useRouter();
  const bgColor = note.color;
  const defaultColor = "#fef3c7";

  return (
    <Card
      className="cursor-pointer"
      onClick={() => {
        router.push(`/notes/${note.noteNo}`);
      }}
    >
      <CardTitle
        className="text-[20px] px-2 py-1 border-b border-gray-400"
        style={{ backgroundColor: bgColor ?? defaultColor }}
      >
        {note.title || "No Title"}
      </CardTitle>
      <CardContent>
        <div
          className="p-3"
          style={{ backgroundColor: bgColor ?? defaultColor }}
        >
          <div
            className="overflow-hidden h-[250px]"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
          <div className="flex pt-1 w-full justify-end gap-3 items-center text-md text-gray-500 border-t border-gray-400">
            <div className="flex items-center gap-1">
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
      </CardContent>
    </Card>
  );
}
