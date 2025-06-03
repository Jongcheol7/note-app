"use client";
import { useColorStore } from "@/store/useColorStore";
import CommunityLists from "./components/CommunityLists";
import { useEffect } from "react";

export default function CommunityPage() {
  const { initColor } = useColorStore();

  useEffect(() => {
    initColor();
  }, [initColor]);
  return <CommunityLists />;
}
