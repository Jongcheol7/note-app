"use client";
import { useEffect, useState } from "react";
import PasswordPopup from "./PasswordPopup";
import { useFromStore } from "@/store/useFromStore";

export default function SettingMain() {
  const [showPwPopup, setShowPwPopup] = useState(false);
  const { setMenuFrom } = useFromStore();

  useEffect(() => {
    setMenuFrom("settings");
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <button
        className="text-2xl font-bold"
        onClick={() => setShowPwPopup((prev) => !prev)}
      >
        비밀번호
      </button>
      <button className="text-2xl font-bold">다크모드</button>

      {showPwPopup ? <PasswordPopup setShow={setShowPwPopup} /> : undefined}
    </div>
  );
}
