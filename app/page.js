"use client";
import { ColorStore } from "@/store/ColorStore";
import NoteLists from "@app/notes/components/NoteLists";
import { useEffect } from "react";

export default function Home() {
  const { initColor } = ColorStore();

  useEffect(() => {
    initColor();
  }, [initColor]);

  return <NoteLists />;
}
