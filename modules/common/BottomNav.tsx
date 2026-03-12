"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFromStore } from "@/store/useFromStore";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Home,
  MessageSquare,
  Plus,
  CalendarDays,
  MoreHorizontal,
  Trash2,
  Lock,
  Folders,
  Settings,
  LogIn,
  LogOut,
  X,
} from "lucide-react";
import { MENU } from "@/lib/constants";
import PasswordCheckPopup from "../settings/PasswordCheckPopup";
import Popup from "@/components/common/Popup";

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false);
  const [showPwPopup, setShowPwPopup] = useState(false);
  const { menuFrom, setMenuFrom } = useFromStore();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // 노트 디테일/글쓰기 페이지에서는 하단 네비 숨김
  if (pathname.startsWith("/notes/")) return null;

  const isActive = (menu: string) => menuFrom === menu;

  const navItems = [
    {
      icon: Home,
      label: "홈",
      menu: MENU.HOME,
      action: () => { setMenuFrom(MENU.HOME); router.push("/"); },
    },
    {
      icon: MessageSquare,
      label: "커뮤니티",
      menu: MENU.COMMUNITY,
      action: () => { setMenuFrom(MENU.COMMUNITY); router.push("/"); },
    },
    {
      icon: Plus,
      label: "글쓰기",
      menu: "__write__",
      action: () => router.push("/notes/write"),
      isCenter: true,
    },
    {
      icon: CalendarDays,
      label: "달력",
      menu: MENU.CALENDAR,
      action: () => { setMenuFrom(MENU.CALENDAR); router.push("/calendar"); },
    },
    {
      icon: MoreHorizontal,
      label: "더보기",
      menu: "__more__",
      action: () => setShowMore(true),
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border/50">
        <div className="mx-auto max-w-lg flex items-center justify-around h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.menu);

            if (item.isCenter) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  aria-label={item.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground active:scale-95 transition-transform"
                >
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </button>
              );
            }

            return (
              <button
                key={item.label}
                onClick={item.action}
                aria-label={item.label}
                className="flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors"
              >
                <Icon
                  className={`w-[20px] h-[20px] ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                  strokeWidth={active ? 2.2 : 1.5}
                />
                <span
                  className={`text-[10px] ${
                    active ? "text-foreground font-semibold" : "text-muted-foreground font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* safe area for notch devices */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* 더보기 바텀시트 */}
      {showMore && (
        <Popup onClose={() => setShowMore(false)} bottomSheet>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold">더보기</h3>
            <button
              onClick={() => setShowMore(false)}
              aria-label="닫기"
              className="p-1.5 rounded-full hover:bg-secondary transition"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-1">
            {[
              {
                icon: Trash2,
                label: "휴지통",
                desc: "삭제된 메모",
                action: () => { setMenuFrom(MENU.TRASH); router.push("/"); setShowMore(false); },
              },
              {
                icon: Lock,
                label: "비밀노트",
                desc: "비밀번호로 보호",
                action: () => { setShowMore(false); setShowPwPopup(true); },
              },
              {
                icon: Folders,
                label: "카테고리",
                desc: "카테고리 관리",
                action: () => { setMenuFrom(MENU.CATEGORY); router.push("/category"); setShowMore(false); },
              },
              {
                icon: Settings,
                label: "설정",
                desc: "앱 설정",
                action: () => { setMenuFrom(MENU.SETTINGS); router.push("/settings"); setShowMore(false); },
              },
              {
                icon: session ? LogOut : LogIn,
                label: session ? "로그아웃" : "로그인",
                desc: session ? session.user?.email ?? "" : "Google 계정으로 로그인",
                action: () => { session ? signOut() : signIn("google"); setShowMore(false); },
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/70 active:scale-[0.98] transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] text-foreground/70" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Popup>
      )}

      {showPwPopup && (
        <PasswordCheckPopup
          setShow={setShowPwPopup}
          onSuccess={() => {
            setShowPwPopup(false);
            router.push("/");
          }}
        />
      )}
    </>
  );
}
