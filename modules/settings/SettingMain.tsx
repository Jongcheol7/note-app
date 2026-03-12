"use client";
import { useEffect, useState } from "react";
import { ChevronRight, KeyRound, Moon } from "lucide-react";
import PasswordPopup from "./PasswordPopup";
import { useFromStore } from "@/store/useFromStore";
import { MENU } from "@/lib/constants";

export default function SettingMain() {
  const [showPwPopup, setShowPwPopup] = useState(false);
  const { setMenuFrom } = useFromStore();

  useEffect(() => {
    setMenuFrom(MENU.SETTINGS);
  }, []);

  const menuItems = [
    {
      icon: KeyRound,
      label: "비밀번호 설정",
      desc: "비밀노트 잠금 비밀번호",
      onClick: () => setShowPwPopup(true),
    },
    {
      icon: Moon,
      label: "다크모드",
      desc: "준비중",
      onClick: () => {},
      disabled: true,
    },
  ];

  return (
    <div className="pt-2">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              disabled={item.disabled}
              className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border shadow-card hover:shadow-soft transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {showPwPopup && <PasswordPopup setShow={setShowPwPopup} />}
    </div>
  );
}
