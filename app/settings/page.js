"use client";
import { useEffect, useState } from "react";
import PasswordPopup from "./components/PasswordPopup";
import { useColorStore } from "@/store/useColorStore";

export default function SettingsPage() {
  const [showPwPopup, setShowPwPopup] = useState(false);
  const { initColor } = useColorStore();

  useEffect(() => {
    initColor();
  }, [initColor]);

  return (
    <div className="flex flex-col gap-5">
      <button
        className="text-2xl font-bold"
        onClick={() => setShowPwPopup((prev) => !prev)}
      >
        비밀번호
      </button>
      <button className="text-2xl font-bold">다크모드</button>

      {showPwPopup ? (
        <PasswordPopup show={showPwPopup} setShow={setShowPwPopup} />
      ) : undefined}
    </div>
  );
}
