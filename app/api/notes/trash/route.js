import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(requset) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  const { searchParams } = new URL(requset.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        delDatetime: { not: null },
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
      orderBy: {
        sortOrder: "asc",
      },
      skip,
      take: pageSize,
    });

    // 전체 개수 가져와서 다음 페이지 여부 확인
    const total = await prisma.note.count({
      where: {
        userId,
        delDatetime: { not: null },
      },
    });
    const hasNextPage = page * pageSize < total;

    return Response.json({ notes, hasNextPage });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "휴지통 조회에 실패했습니다." }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
