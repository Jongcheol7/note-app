"use client";
import NoteLists from "@/modules/notes/NoteLists";
import { useColorStore } from "@/store/useColorStore";
import { useEffect } from "react";
export default function Page() {
  const { color, initColor } = useColorStore();
  useEffect(() => {
    initColor();
  }, []);
  return <NoteLists />;
}
