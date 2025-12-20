"use client";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { usePinMutation } from "@/hooks/notes/usePinMutation";
import { useFromStore } from "@/store/useFromStore";

export default function NoteCard({ note }) {
  const safeHTML = DOMPurify.sanitize(note.content); //악성스크립트제거
  const formattedDate = new Date(note.modDatetime).toLocaleDateString();
  const { mutate: pinMutate, isPending: isPinning } = usePinMutation();
  const { menuFrom } = useFromStore();
  const router = useRouter();
  const bgColor = note.color;
  const defaultColor = "#fef3c7";

  return (
    <Card className="h-[250px] flex flex-col">
      <CardTitle
        className="flex text-[20px] px-2 py-1 border-b border-gray-400"
        style={{ backgroundColor: bgColor ?? defaultColor }}
      >
        <p className="flex-1">{note.title || "No Title"}</p>
        {menuFrom == "" && (
          <button
            onClick={() =>
              pinMutate({ isPinned: !note.isPinned, noteNo: note.noteNo })
            }
            disabled={isPinning}
          >
            <Star
              size={18}
              strokeWidth={2}
              //fill={note.isPinned ? "red" : "none"}
              className={`${note?.isPinned ? "fill-red-500" : "none"}`}
            />
          </button>
        )}
      </CardTitle>
      <CardContent
        className="flex-1 overflow-hidden cursor-pointer "
        style={{ backgroundColor: bgColor ?? defaultColor }}
        onClick={() => {
          router.push(`/notes/${note.noteNo}`);
        }}
      >
        <div
          className="h-full p-1 overflow-hidden text-ellipsis"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </CardContent>
      <CardFooter style={{ backgroundColor: bgColor ?? defaultColor }}>
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
      </CardFooter>
    </Card>
  );
}
