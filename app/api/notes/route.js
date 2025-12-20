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
      { status: 401 }
    );
  }
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit"));
  const keyword = searchParams.get("keyword").trim() || "";
  const menuFrom = searchParams.get("menuFrom").trim() || "";
  const categoryName = searchParams.get("categoryName").trim() || "";

  console.log("라우트내 menu 감지 : ", menuFrom);

  const whereCondition = {
    //userId,
    // ...(menuFrom === "secret" ? { isSecret: true } : { isSecret: false }),
    // ...(menuFrom === "trash"
    //   ? { delDatetime: { not: null } }
    //   : { delDatetime: null }),
    // ...(menuFrom === "community" ? { isPublic: true } : { isPublic: false }),
    ...(keyword && {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { plainText: { contains: keyword, mode: "insensitive" } },
      ],
    }),
  };

  // 메뉴별 조건 분기
  if (menuFrom === "") {
    whereCondition.userId = userId;
    whereCondition.delDatetime = null;
    whereCondition.isSecret = false;
  } else if (menuFrom === "secret") {
    whereCondition.userId = userId;
    whereCondition.delDatetime = null;
    whereCondition.isSecret = true;
    whereCondition.isPublic = false;
  } else if (menuFrom === "trash") {
    whereCondition.userId = userId;
    whereCondition.delDatetime = { not: null };
  } else if (menuFrom === "community") {
    whereCondition.delDatetime = null;
    whereCondition.isSecret = false;
    whereCondition.isPublic = true;
  }
  console.log("whereCondition : ", whereCondition);
  try {
    const notes = await prisma.note.findMany({
      where: {
        ...whereCondition,
        ...(categoryName && {
          category: {
            userId,
            name: categoryName,
          },
        }),
      },
      include: {
        _count: {
          select: { likes: true },
        },
        likes: {
          where: { userId },
          select: { userId: true },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { pinDatetime: "desc" },
        { modDatetime: "desc" },
      ],
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
