import { NextResponse } from "next/server";
import db from "@/lib/db";
import { insertNote } from "@/lib/note-db";

export async function POST(requset) {
  try {
    const { title, content } = await requset.json();
    if (!content && content.trim().length() === 0) {
      return NextResponse.json(
        { success: false, message: "내용이 비었습니다." },
        { status: 400 }
      );
    }

    // 여기서 db에 저장해보자
  } catch (err) {
    console.log("저장오류:", err);
    return NextResponse.json(
      { success: false, message: "저장 중 오류 발생" },
      { status: 500 }
    );
  }
}
