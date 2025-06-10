//import { selectNoteLists } from "@/lib/note-db";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const url = new URL(req.url);
  const paths = url.pathname.split("/");
  const noteNo = Number(paths[paths.length - 1]);

  //쿼리 파라미터 가져오기
  const { searchParams } = new URL(req.url);
  const menuFrom = searchParams.get("menuFrom");

  if (!noteNo) {
    return new Response("글 번호가 없습니다.", { status: 401 });
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    const note = await prisma.note.findFirst({
      where: {
        userId,
        noteNo,
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
    });

    //유저가 다르면 접근 차단
    if (menuFrom !== "community" && (!note || note.userId !== userId)) {
      return new Response("노트를 찾을수 없거나 조회 권한이 없습니다.", {
        status: 404,
      });
    }

    return Response.json(note);
  } catch (err) {
    return new Response("노트 조회에 실패했습니다.", {
      status: 404,
    });
  }
}
