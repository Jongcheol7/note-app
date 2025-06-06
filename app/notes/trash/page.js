"use client";
import { useColorStore } from "@/store/useColorStore";
import TrashLists from "../components/TrashLists";
import { useEffect } from "react";

export default function NoteTrashPage() {
  const { initColor } = useColorStore();

  useEffect(() => {
    initColor();
  }, [initColor]);

  return <TrashLists />;
}
