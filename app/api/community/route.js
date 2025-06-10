import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.log("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const keyword = searchParams.get("keyword")?.trim() || "";
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const whereCondition = {
    delDatetime: null,
    isPublic: true,
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
      skip,
      take: pageSize,
    });

    // 전체 개수 가져와서 다음 페이지 여부 확인
    const total = await prisma.note.count({
      where: whereCondition,
    });
    const hasNextPage = page * pageSize < total;

    return Response.json({ notes, hasNextPage });
  } catch (err) {
    return new Response("노트 조회에 실패했습니다.", {
      status: 404,
    });
  }
}
