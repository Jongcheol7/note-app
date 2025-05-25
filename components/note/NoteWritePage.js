"use client";
import Editor from "@/components/note/Editor";
import NoteToolbar from "@/components/note/NoteToolbar";
import { useState } from "react";

export default function NoteWritePage() {
  const [editor, setEditor] = useState(null);
  return (
    <div className="relative flex flex-col h-[calc(100vh-150px)]">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        className="bg-amber-100 text-xl font-semibold"
      />
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
