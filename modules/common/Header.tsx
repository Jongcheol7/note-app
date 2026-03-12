"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useFromStore } from "@/store/useFromStore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { VALID_MENU_FROM, MENU } from "@/lib/constants";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { keyword, setKeyword } = useSearchStore();
  const { menuFrom, setMenuFrom } = useFromStore();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // 노트 디테일/글쓰기 페이지에서는 헤더 숨김
  if (pathname.startsWith("/notes/")) return null;

  const showSearch = VALID_MENU_FROM.includes(menuFrom);

  const menuLabel: Record<string, string> = {
    "": "NoteApp",
    secret: "비밀노트",
    trash: "휴지통",
    community: "커뮤니티",
    calendar: "달력",
    category: "카테고리",
    settings: "설정",
  };

  const isHome = menuFrom === "" || menuFrom === MENU.HOME;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md py-3" style={{ backgroundColor: "inherit" }}>
      {!isSearchOpen ? (
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setMenuFrom(MENU.HOME);
              router.push("/");
            }}
          >
            {isHome && (
              <Image
                src="/logo.png"
                alt="NoteApp"
                width={24}
                height={24}
                className="rounded"
              />
            )}
            <h1 className="text-lg font-bold tracking-tight">
              {menuLabel[menuFrom] ?? "NoteApp"}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {showSearch && (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="검색"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
            )}
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="프로필"
                width={28}
                height={28}
                className="rounded-full ml-1"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="flex-1 flex items-center bg-secondary/80 rounded-full px-3.5 py-2 gap-2">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="메모 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setKeyword("");
            }}
            aria-label="검색 닫기"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
