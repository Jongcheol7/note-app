"use client";

import { ResizeImageIfNeeded } from "@/components/common/ResizeImageIfNeeded";
import {
  Bold,
  List,
  Smile,
  ImagePlus,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SquareCheckBig,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
const FONT_SIZES = ["14px", "16px", "20px", "24px", "28px", "32px"];
const COLOR_PALETTE = [
  "#000000", "#e11d48", "#f97316", "#eab308",
  "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

interface NoteToolbarProps {
  editor: ReturnType<typeof import("@tiptap/react").useEditor>;
}

export default function NoteToolbar({ editor }: NoteToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setIsFontSizeOpen(false);
        setIsAlignOpen(false);
        setIsColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MAX_IMAGES = 20;
  const MAX_FILE_SIZE_MB = 3;
  const MAX_IMAGE_WIDTH = 1200;
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`이미지 크기는 ${MAX_FILE_SIZE_MB}MB 이하만 가능합니다.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const currentImageCount = (
      editor.getHTML().match(/<img[^>]*src="data:image\/[^;]*;base64[^>]*>/g) || []
    ).length;

    if (currentImageCount >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지만 첨부할 수 있습니다.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const resizedBase64 = await ResizeImageIfNeeded(base64, MAX_IMAGE_WIDTH);
      editor.commands.insertContent({
        type: "resizableImage",
        attrs: { src: resizedBase64 },
      });
    };
    reader.readAsDataURL(file);
  };

  const toolbarBtnClass = "p-2 rounded-xl transition-colors hover:bg-secondary active:scale-95 text-muted-foreground hover:text-foreground";

  return (
    <div
      ref={toolbarRef}
      className="w-full max-w-lg mx-auto flex justify-around items-center"
    >
      {/* 글자크기 */}
      <div className="relative">
        <button
          className={toolbarBtnClass}
          aria-label="글자 크기"
          onClick={() => {
            setIsFontSizeOpen((prev) => !prev);
            setIsAlignOpen(false);
            setIsColorOpen(false);
          }}
        >
          <Type className="w-4.5 h-4.5" />
        </button>
        {isFontSizeOpen && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl shadow-float flex flex-col z-50 text-sm overflow-hidden animate-fade-in">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setTimeout(() => editor.chain().focus().setFontSize(size).run(), 0);
                  setIsFontSizeOpen(false);
                }}
                className="px-4 py-2 hover:bg-secondary transition-colors text-sm"
              >
                {size.replace("px", "")}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className={toolbarBtnClass}
        aria-label="굵게"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4.5 h-4.5" />
      </button>

      {/* 정렬 */}
      <div className="relative">
        <button
          className={toolbarBtnClass}
          aria-label="정렬"
          onClick={() => {
            setIsFontSizeOpen(false);
            setIsAlignOpen((prev) => !prev);
            setIsColorOpen(false);
          }}
        >
          <AlignCenter className="w-4.5 h-4.5" />
        </button>
        {isAlignOpen && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl shadow-float flex gap-1 p-1.5 z-50 animate-fade-in">
            {[
              { icon: AlignLeft, align: "left" },
              { icon: AlignCenter, align: "center" },
              { icon: AlignRight, align: "right" },
            ].map(({ icon: Icon, align }) => (
              <button
                key={align}
                className={toolbarBtnClass}
                onClick={() => {
                  setTimeout(() => editor.chain().focus().setTextAlign(align).run(), 0);
                  setIsAlignOpen(false);
                }}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageSelect} />
      <button className={toolbarBtnClass} aria-label="이미지 첨부" onClick={() => fileInputRef.current?.click()}>
        <ImagePlus className="w-4.5 h-4.5" />
      </button>

      <button className={toolbarBtnClass} aria-label="목록" onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-4.5 h-4.5" />
      </button>

      <button className={toolbarBtnClass} aria-label="체크리스트" onClick={() => editor.chain().focus().toggleTaskList().run()}>
        <SquareCheckBig className="w-4.5 h-4.5" />
      </button>

      <button className={toolbarBtnClass} aria-label="이모지 삽입" onClick={() => editor.chain().focus().insertContent("📝").run()}>
        <Smile className="w-4.5 h-4.5" />
      </button>

      {/* 글자색 */}
      <div className="relative">
        <button
          className={`${toolbarBtnClass} ${isColorOpen ? "text-primary" : ""}`}
          aria-label="글자 색상"
          onClick={() => {
            setIsFontSizeOpen(false);
            setIsAlignOpen(false);
            setIsColorOpen((prev) => !prev);
          }}
        >
          <Paintbrush className="w-4.5 h-4.5" />
        </button>
        {isColorOpen && (
          <div className="absolute bottom-full mb-2 right-0 bg-card border border-border rounded-xl shadow-float p-2 z-50 flex gap-1.5 animate-fade-in">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setTimeout(() => editor.chain().focus().setColor(color).run(), 0);
                  setIsColorOpen(false);
                }}
                className="w-6 h-6 rounded-full border-2 border-transparent hover:border-foreground/20 transition-colors hover:scale-110"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
