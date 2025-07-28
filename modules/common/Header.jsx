"use client";
import Link from "next/link";
import { useState } from "react";
import { Home } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useRouter } from "next/navigation";
import { useFromStore } from "@/store/useFromStore";
import NavMain from "./NavMain";
import { Input } from "@/components/ui/input";
import PasswordCheckPopup from "../settings/PasswordCheckPopup";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPwPopup, setShowPwPopup] = useState(false);
  const { keyword, setKeyword } = useSearchStore();
  const { setMenuFrom } = useFromStore();

  const router = useRouter();

  return (
    <>
      <header className="flex justify-between py-3 gap-2 items-center mb-3">
        <button
          className="text-2xl  text-gray-900 hover:text-blue-800 transition-all duration-200"
          aria-label="메뉴 열기"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <Input
          type="text"
          placeholder="🔍 메모 검색"
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-gray-100 rounded-xl"
        />
        <Link
          href={"/"}
          onClick={() => {
            setMenuFrom("note");
          }}
        >
          <Home className="text-2xl font-medium text-gray-900 hover:text-red-800 transition-all duration-200">
            🏠
          </Home>
        </Link>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <NavMain
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setShowPwPopup={setShowPwPopup}
      />

      {showPwPopup && (
        <PasswordCheckPopup
          setShow={setShowPwPopup}
          onSuccess={() => {
            setShowPwPopup(false);
            router.push("/notes/secret");
          }}
        />
      )}
    </>
  );
}
