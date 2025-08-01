"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { ResizableImage } from "@/components/common/ResizableImage";
import { toast } from "sonner";
import {
  Color,
  FontSize,
  TextStyle,
  TextStyleKit,
} from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

export default function Editor({ setEditor, content, menu }) {
  const safeHTML = DOMPurify.sanitize(content); // content 안에 <img src="data:..." />가 포함됨
  const prevImgsRef = useRef([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // ✅ undo/redo 자체를 끔
      }),
      Placeholder.configure({
        placeholder: "여기에 메모를 입력하세요...",
      }),
      //Image,
      ResizableImage,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    immediatelyRender: false,
    content: "", // ❌ 초기화 때는 비우고 useEffect에서 setContent 사용
    editable: menu !== "community",
    autofocus: false,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      console.log("이미지 삭제 실행됨 : ", html);
      const currentImgs = [
        ...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g),
      ].map((m) => m[1]);
      console.log("currentImgs :", currentImgs);

      // 2. 직전 이미지 리스트와 비교해서 삭제된 이미지가 있는지 확인
      const deletedImgs = prevImgsRef.current.filter(
        (src) => !currentImgs.includes(src)
      );
      console.log("deletedImgs :", deletedImgs);
      // 3. 삭제된 이미지가 CloudFront라면 S3 삭제 요청
      deletedImgs.forEach((src) => {
        console.log("src : ", src);
        console.log(
          "process.env.CLOUDFRONT_DOMAIN_NAME : ",
          process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME
        );
        if (src.startsWith(process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME)) {
          console.log("이미지 삭제 route 넘기기전");
          fetch("/api/notes/image", {
            method: "POST",
            body: JSON.stringify({ imageUrl: src }),
            headers: { "Content-Type": "application/json" },
          });
        }
      });

      // 4. 현재 이미지 리스트를 저장
      prevImgsRef.current = currentImgs;
    },
  });

  useEffect(() => {
    if (editor && setEditor) {
      setEditor(editor);

      // ✅ content 안의 base64 <img>를 커스텀 노드로 처리
      editor.commands.setContent(safeHTML);
      //editor.commands.setColor("#ff0000");
      const initImgs = [
        ...safeHTML.matchAll(/src="([^"]+\.(jpeg|jpg|png|webp|gif))"/gi),
      ].map((m) => m[1]);
      prevImgsRef.current = initImgs;
    }
  }, [editor, setEditor, safeHTML]);

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
        className={`tiptap h-full w-full overflow-y-auto scrollbar-none ${
          menu === "community" ? "no-select" : ""
        }`}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y")) {
            e.preventDefault();
            toast.error("컨트롤z 혹은 y는 사용 불가합니다.");
          }
        }}
      />
    </div>
  );
}
