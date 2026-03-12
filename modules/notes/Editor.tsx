"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";
import { ResizableImage } from "@/components/common/ResizableImage";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { MENU } from "@/lib/constants";

interface EditorProps {
  setEditor: (editor: ReturnType<typeof useEditor>) => void;
  content: string;
  menu: string;
}

const extensions = [
  StarterKit,
  Placeholder.configure({ placeholder: "여기에 메모를 입력하세요..." }),
  ResizableImage,
  TextStyle,
  Color,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  FontSize.configure({ types: ["textStyle"] }),
  TaskList,
  TaskItem.configure({ nested: true }),
];

export default function Editor({ setEditor, content, menu }: EditorProps) {
  const safeHTML = useMemo(() => DOMPurify.sanitize(content), [content]);
  const prevImgsRef = useRef<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: "",
    editable: menu !== MENU.COMMUNITY,
    autofocus: false,
    onUpdate({ editor }) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const html = editor.getHTML();
        const currentImgs = [
          ...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g),
        ].map((m) => m[1]);

        const deletedImgs = prevImgsRef.current.filter(
          (src) => !currentImgs.includes(src)
        );

        deletedImgs.forEach((src) => {
          if (src.startsWith(process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME ?? "")) {
            fetch("/api/notes/image", {
              method: "POST",
              body: JSON.stringify({ imageUrl: src }),
              headers: { "Content-Type": "application/json" },
            }).catch((err) => console.error("S3 이미지 삭제 실패:", err));
          }
        });

        prevImgsRef.current = currentImgs;
      }, 1000);
    },
  });

  useEffect(() => {
    if (editor && setEditor) {
      setEditor(editor);
      editor.commands.setContent(safeHTML);
      const initImgs = [
        ...safeHTML.matchAll(/src="([^"]+\.(jpeg|jpg|png|webp|gif))"/gi),
      ].map((m) => m[1]);
      prevImgsRef.current = initImgs;
    }
  }, [editor, setEditor, safeHTML]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!editor) return null;

  return (
    <div
      onCopy={menu === MENU.COMMUNITY ? (e) => e.preventDefault() : undefined}
      onPaste={menu === MENU.COMMUNITY ? (e) => e.preventDefault() : undefined}
      onCut={menu === MENU.COMMUNITY ? (e) => e.preventDefault() : undefined}
      onContextMenu={menu === MENU.COMMUNITY ? (e) => e.preventDefault() : undefined}
      onDragStart={menu === MENU.COMMUNITY ? (e) => e.preventDefault() : undefined}
    >
      <EditorContent
        editor={editor}
        className={`tiptap ${menu === MENU.COMMUNITY ? "no-select" : ""}`}
      />
    </div>
  );
}
