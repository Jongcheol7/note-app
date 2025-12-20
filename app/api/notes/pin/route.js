import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인 정보가 없습니다.");
    return NextResponse.json(
      { error: "로그인 정보가 없습니다" },
      { status: 401 }
    );
  }
  const userId = session.user.id;
  const { isPinned, noteNo } = await request.json();
  console.log("받은 데이터 : ", { isPinned, noteNo });

  if (typeof isPinned !== "boolean" || typeof noteNo !== "number") {
    console.error("잘못된 데이터 형식입니다.");
    return NextResponse.json(
      { error: "잘못된 데이터 형식입니다." },
      { status: 400 }
    );
  }

  try {
    // 노트의 소유자가 현재 로그인한 사용자와 일치하는지 확인
    const searchedNote = await prisma.note.findUnique({
      where: { noteNo },
    });

    if (!searchedNote || searchedNote.userId !== userId) {
      console.error("노트를 찾을 수 없거나 권한이 없습니다.");
      return NextResponse.json(
        { error: "노트를 찾을 수 없거나 권한이 없습니다." },
        { status: 403 }
      );
    } else {
      const updateNote = await prisma.note.update({
        where: { noteNo },
        data: {
          isPinned,
          pinDatetime: isPinned ? new Date() : null,
        },
      });
      return NextResponse.json(updateNote, { status: 200 });
    }
  } catch (err) {
    console.error("노트 핀 변경에 실패했습니다. : ", err);
    return NextResponse.json(
      { error: "노트 핀 변경에 실패했습니다." },
      { status: 500 }
    );
  }
}
