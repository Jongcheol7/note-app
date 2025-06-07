"use client";
import { useColorStore } from "@/store/useColorStore";
import NoteCalendar from "./components/NoteCalendar";
import { useEffect } from "react";

export default function CalenderPage() {
  const { initColor } = useColorStore();

  useEffect(() => {
    initColor();
  }, [initColor]);
  return <NoteCalendar />;
}
