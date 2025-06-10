import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const req = await request.json();
  const isLike = req.isLike;
  const noteNo = req.noteNo;

  console.log("좋아요 api 라우트 진입 : ", isLike, noteNo);

  if (!noteNo) {
    console.error("노트 번호가 없습니다.");
    return new Response("노트 번호가 없습니다.", { status: 400 });
  }
  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;
  try {
    let result;
    if (isLike) {
      result = await prisma.like.create({
        data: { noteNo, userId },
      });
    } else {
      result = await prisma.like.delete({
        where: {
          userId_noteNo: { noteNo, userId },
        },
      });
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("좋아요 변경에 실패했습니다. : ", err);
    return new Response("좋아요 변경에 실패했습니다.", { status: 500 });
  }
}
