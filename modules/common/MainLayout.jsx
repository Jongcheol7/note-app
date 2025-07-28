"use client";
import { useColorStore } from "@/store/useColorStore";
import { useEffect } from "react";

export default function MainLayout({ children }) {
  const { color, initColor } = useColorStore();
  useEffect(() => {
    initColor();
    document.body.style.backgroundColor = color;
  }, [initColor]);

  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return <div>{children}</div>;
}
