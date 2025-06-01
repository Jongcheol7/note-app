//import { selectNoteLists } from "@/lib/note-db";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  // 무한스크롤로 변경후 페이지 번호를 추출하자(기본 1로 시작)
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const keyword = searchParams.get("keyword")?.trim() || "";
  const pageSize = 10; //한 페이지에 몇개의 글을 보여줄지
  const skip = (page - 1) * pageSize; //앞에서 몇개의 글을 건너뛸지

  const whereCondition = {
    userId,
    delDatetime: null,
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
    return new Response(
      JSON.stringify({ message: "노트 조회에 실패했습니다" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
