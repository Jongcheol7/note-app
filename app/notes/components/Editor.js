"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import DOMPurify from "dompurify";
import { ResizableImage } from "@/components/common/ResizableImage";
import Image from "@tiptap/extension-image";

export default function Editor({ onEditorReady, content, menu }) {
  const safeHTML = DOMPurify.sanitize(content); // content 안에 <img src="data:..." />가 포함됨

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "여기에 메모를 입력하세요...",
      }),
      //Image,
      ResizableImage,
    ],
    autofocus: true,
    content: "", // ❌ 초기화 때는 비우고 useEffect에서 setContent 사용
    editable: menu !== "community",
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);

      // ✅ content 안의 base64 <img>를 커스텀 노드로 처리
      editor.commands.setContent(safeHTML);
    }
  }, [editor, onEditorReady]);

  if (!editor) return null;

  return (
    <div
      className={`h-full`}
      onCopy={menu === "community" ? (e) => e.preventDefault() : undefined}
      onPaste={menu === "community" ? (e) => e.preventDefault() : undefined}
      onCut={menu === "community" ? (e) => e.preventDefault() : undefined}
      onContextMenu={
        menu === "community" ? (e) => e.preventDefault() : undefined
      }
      onDragStart={menu === "community" ? (e) => e.preventDefault() : undefined}
    >
      <EditorContent
        editor={editor}
        className={`tiptap h-full w-full  ${
          menu === "community" ? "no-select" : ""
        }`}
      />
    </div>
  );
}
