"use client";
import { useColorStore } from "@/store/useColorStore";
import NoteLists from "@app/notes/components/NoteLists";
import { useEffect } from "react";

export default function Home() {
  const { initColor } = useColorStore();

  useEffect(() => {
    initColor();
  }, [initColor]);

  return <NoteLists />;
}
