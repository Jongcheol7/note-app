"use client";
import { useColorStore } from "@/store/useColorStore";
import { useEffect } from "react";
import NoteLists from "../components/NoteLists";

export default function SecretPage() {
  const { initColor } = useColorStore();

  useEffect(() => {
    initColor();
  }, [initColor]);

  return <NoteLists />;
}
