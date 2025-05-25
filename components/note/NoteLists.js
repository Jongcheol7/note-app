"use client";

import Link from "next/link";

export default function NoteLists() {
  return (
    <>
      <Link
        href={"/note/note-write"}
        className="fixed right-7 bottom-7 h-7 w-7 pb-2 z-40 rounded flex items-center justify-center bg-gray-800 text-white font-bold text-2xl shadow-md"
      >
        +
      </Link>
    </>
  );
}
