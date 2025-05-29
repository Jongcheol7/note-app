"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

export default function Editor({ onEditorReady }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "여기에 메모를 입력하세요...",
      }),
      Image,
    ],
    autofocus: true,
    immediatelyRender: false, // ✅ SSR 방지 핵심
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="h-full">
      <EditorContent editor={editor} className="h-full w-full" />
    </div>
  );
}
