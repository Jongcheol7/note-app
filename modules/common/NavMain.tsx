import { useFromStore } from "@/store/useFromStore";
import {
  Calendar,
  Folders,
  Lock,
  LogIn,
  LogOut,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MENU } from "@/lib/constants";

interface NavMainProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
  setShowPwPopup: (v: boolean) => void;
}

export default function NavMain({ isMenuOpen, setIsMenuOpen, setShowPwPopup }: NavMainProps) {
  const { menuFrom, setMenuFrom } = useFromStore();
  const { data: session, status } = useSession();

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 z-50 font-bold`}
    >
      <div className="flex justify-between items-center px-3 py-2 mt-3 mb-7">
        <p className="text-2xl">📒 Dev Note 📒</p>
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
            href={"/"}
            onClick={() => {
              setIsMenuOpen(false);
              setMenuFrom(MENU.TRASH);
            }}
            className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
          >
            <Trash2 />
            <span>휴지통</span>
          </Link>
          <Link
            href={"/calendar"}
            onClick={() => {
              setIsMenuOpen(false);
              setMenuFrom(MENU.CALENDAR);
            }}
            className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
          >
            <Calendar />
            <span>달력</span>
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setShowPwPopup(true);
            }}
            className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
          >
            <Lock />
            <span>비밀노트</span>
          </button>

          <Link
            href={"/"}
            className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
            onClick={() => {
              setIsMenuOpen(false);
              setMenuFrom(MENU.COMMUNITY);
            }}
          >
            <MessageSquare />
            <span>커뮤니티</span>
          </Link>

          <Link
            href={"/category"}
            className="flex gap-1 w-fit hover:text-blue-800 transition duration-300"
            onClick={() => {
              setIsMenuOpen(false);
              setMenuFrom(MENU.CATEGORY);
            }}
          >
            <Folders />
            <span>카테고리</span>
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
            href={"/settings"}
            onClick={() => setIsMenuOpen(false)}
            className="w-fit hover:text-blue-800 transition duration-300"
          >
            ⚙️ 설정
          </Link>
        </div>
      </nav>
    </aside>
  );
}
