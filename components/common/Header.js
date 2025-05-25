"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/UserStore";
import { Home } from "lucide-react";

export default function Header({ initialUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  console.log("initialUser : ", initialUser);

  useEffect(() => {
    if (!initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  return (
    <>
      <header className="flex justify-between py-3 gap-2 items-center mb-7">
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
        />
        <Link href={"/"}>
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
        <div className="flex justify-between items-center px-3 py-3">
          <p className="text-lg">종철Note!!</p>
          <button
            className="text-2xl hover:text-red-800 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col px-3 gap-3">
          <Link
            href={"/"}
            onClick={() => setIsMenuOpen(false)}
            className="w-fit hover:text-blue-800 transition duration-300"
          >
            🗑 휴지통
          </Link>
          <Link
            href={"/"}
            onClick={() => setIsMenuOpen(false)}
            className="w-fit hover:text-blue-800 transition duration-300"
          >
            🔔 알림
          </Link>
          <Link
            href={"/"}
            onClick={() => setIsMenuOpen(false)}
            className="w-fit hover:text-blue-800 transition duration-300"
          >
            🔒 비밀노트
          </Link>

          <div className="flex flex-col gap-3 mt-6 border-t pt-3">
            <button
              onClick={() => (window.location.href = "/api/auth/google")}
              className="text-left w-fit hover:text-blue-800 transition duration-300"
            >
              🔐 로그인
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
