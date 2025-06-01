import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(request) {
  const req = await request.json();
  const noteNo = Number(req.noteNo.noteNo);
  console.log("복원 api 진입 ", req);
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
    // 먼저 노트가 존재하는지, 그리고 내 노트인지 확인
    const note = await prisma.note.findUnique({
      where: { noteNo },
    });

    if (!note || note.userId !== userId) {
      return new Response("해당 노트를 찾을 수 없거나 권한이 없습니다.", {
        status: 403,
      });
    }

    const deleted = await prisma.note.update({
      where: { noteNo },
      data: {
        delDatetime: null,
      },
    });
    return new Response(JSON.stringify(deleted), { status: 200 });
  } catch (err) {
    console.error("메모 복원에 실패했습니다. : ", err);
    return new Response("메모 복원에 실패했습니다.", { status: 500 });
  }
}
