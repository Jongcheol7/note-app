//import { selectNoteLists } from "@/lib/note-db";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.error("로그인 정보가 없습니다.");
    return NextResponse.json(
      { error: "로그인 정보가 없습니다." },
      { status: 500 }
    );
  }
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit"));
  const keyword = searchParams.get("keyword").trim() || "";
  const menuFrom = searchParams.get("menuFrom").trim() || "";

  const whereCondition = {
    userId,
    delDatetime: null,
    ...(menuFrom === "secret" ? { isSecret: true } : { isSecret: false }),
    ...(keyword && {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { plainText: { contains: keyword, mode: "insensitive" } },
      ],
    }),
  };

  try {
    const notes = await prisma.note.findMany({
      where: whereCondition,
      include: {
        _count: {
          select: { likes: true },
        },
        likes: {
          where: { userId },
          select: { userId: true },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
      cursor: cursor ? { noteNo: Number(cursor) } : undefined,
      skip: cursor ? 1 : 0,
      take: limit,
    });
    const nextCursor = notes.length > 0 ? notes[notes.length - 1].noteNo : null;

    return Response.json({ notes, nextCursor });
  } catch (err) {
    console.error("노트 조회에 실패했습니다.");
    return NextResponse.json(
      { error: "노트 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
