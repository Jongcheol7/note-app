"use client";

import Link from "next/link";

export default function NoteLists() {
  return (
    <Link
      href={"/note/note-write"}
      className="absolute right-4 bottom-4 h-12 w-12 z-40 rounded-xl flex items-center justify-center bg-gray-800 text-white font-bold text-2xl shadow-md"
    >
      +
    </Link>
  );
}
