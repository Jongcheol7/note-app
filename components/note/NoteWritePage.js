"use client";
import Editor from "@/components/note/Editor";
import NoteToolbar from "@/components/note/NoteToolbar";
import { useNoteMutation } from "@/store/useNoteMutation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NoteWritePage() {
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { mutate, isPending } = useNoteMutation();
  const router = useRouter();

  // editor가 업데이트 될때마다 내용 추출해서 저장하자
  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => {
      const html = editor.getHTML();
      setContent(html);
    };
    editor.on("update", handleUpdate);
    return () => editor.off("update", handleUpdate);
  }, [editor]);

  return (
    <div className="relative flex flex-col h-[calc(100vh-150px)]">
      <div className="flex">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="bg-amber-100 text-xl font-semibold flex-1"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-gray-400 rounded-md py-1 px-2 hover:bg-gray-500 duration-100"
          onClick={() => {
            mutate(
              {
                title,
                thumnail: null,
                category_id: null,
                sort_order: 0,
                content,
              },
              {
                onSuccess: () => {
                  alert("✅ 저장 완료!");
                  router.push("/");
                },
              }
            );
          }}
        >
          저장
        </button>
      </div>
      <div
        className="flex-1 overflow-y-auto"
        onClick={() => editor.chain().focus()}
      >
        <Editor onEditorReady={setEditor} />
      </div>
      <NoteToolbar editor={editor} />
    </div>
  );
}
