"use client";
import { useColorStore } from "@/store/useColorStore";
import { useEffect } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const color = useColorStore((s) => s.color);
  const initColor = useColorStore((s) => s.initColor);

  useEffect(() => {
    initColor();
  }, [initColor]);

  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return <div className="overflow-y-auto scrollbar-none">{children}</div>;
}
