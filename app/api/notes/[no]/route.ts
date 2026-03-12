import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MENU } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const paths = url.pathname.split("/");
  const noteNo = Number(paths[paths.length - 1]);

  //쿼리 파라미터 가져오기
  const { searchParams } = new URL(req.url);
  const menuFrom = searchParams.get("menuFrom");

  if (!noteNo) {
    return new Response("글 번호가 없습니다.", { status: 400 });
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    // where 조건을 동적으로 생성
    const whereCondition: { noteNo: number; userId?: string } = {
      noteNo,
    };

    if (menuFrom !== MENU.COMMUNITY) {
      whereCondition.userId = userId;
    }

    const note = await prisma.note.findFirst({
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
    });

    if (!note) {
      return new Response("노트를 찾을 수 없습니다.", { status: 404 });
    }

    // 커뮤니티: isPublic인 노트만 허용
    if (menuFrom === MENU.COMMUNITY) {
      if (!note.isPublic) {
        return new Response("공개되지 않은 노트입니다.", { status: 403 });
      }
    } else {
      // 일반 조회: 소유자만 접근 가능
      if (note.userId !== userId) {
        return new Response("조회 권한이 없습니다.", { status: 403 });
      }
    }

    return Response.json(note);
  } catch (err) {
    return new Response("노트 조회에 실패했습니다.", {
      status: 404,
    });
  }
}
