"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Home,
  LogIn,
  LogOut,
  MessageSquare,
  Trash2,
  Bell,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { useSearchStore } from "@/store/useSearchStore";
import { useFromStore } from "@/store/useFromStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { keyword, setKeyword } = useSearchStore();
  const { menuFrom, setMenuFrom } = useFromStore();

  return (
    <>
      <header className="flex justify-between py-3 gap-2 items-center mb-3">
        <button
          className="text-2xl font-bold text-gray-900 hover:text-blue-800 transition-all duration-200"
          aria-label="메뉴 열기"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <input
          className="flex-1 h-9 px-2 pl-3 py-1 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
          type="text"
          placeholder="🔍 메모 검색"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Link href={"/"} onClick={() => setMenuFrom("note")}>
          <Home className="text-2xl font-medium text-gray-900 hover:text-red-800 transition-all duration-200">
            🏠
          </Home>
        </Link>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-30 font-bold`}
      >
        <div className="flex justify-between items-center px-3 py-2 mt-3 mb-7">
          <p className="text-2xl">📒 Dev Note 📒</p>
          <button
            className="text-2xl hover:text-red-800 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col px-3 h-[calc(100%-64px)] justify-between">
          <div className="flex flex-col gap-4">
            {session?.user.image && (
              <div className="flex  items-center gap-3 mb-5">
                <Image
                  src={session.user.image}
                  alt="구글 프로필"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <p className="mt-2 text-sm font-semibold">
                  {session.user.name}님 안녕하세요!
                </p>
              </div>
            )}
            <Link
              href={"/notes/trash"}
              onClick={() => setIsMenuOpen(false)}
              className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
            >
              <Trash2 />
              <span>휴지통</span>
            </Link>
            <Link
              href={"/"}
              onClick={() => setIsMenuOpen(false)}
              className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
            >
              <Bell />
              <span>알림</span>
            </Link>
            <Link
              href={"/"}
              onClick={() => setIsMenuOpen(false)}
              className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
            >
              <Lock />
              <span>비밀노트</span>
            </Link>
            <Link
              href={"/community"}
              className="flex gap-1"
              onClick={() => setMenuFrom("community")}
            >
              <MessageSquare />
              <span>커뮤니티</span>
            </Link>
          </div>

          <div className="flex flex-col gap-3 border-t pt-2 mb-10">
            <button
              onClick={async () => {
                session ? signOut() : signIn("google");
              }}
              className="text-left w-fit hover:text-blue-800 transition duration-300"
            >
              {session ? (
                <div className="flex gap-2">
                  <LogOut />
                  <span>로그아웃</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <LogIn />
                  <span>로그인</span>
                </div>
              )}
            </button>
            <Link
              href={"/"}
              onClick={() => setIsMenuOpen(false)}
              className="w-fit hover:text-blue-800 transition duration-300"
            >
              ⚙️ 설정
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
