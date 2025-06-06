import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, { params }) {
  const req = await request.json();
  const date = req.date;
  const { no: noteNo } = params;

  if (!noteNo) {
    console.error("노트 번호가 없습니다.");
    return new Response("노트 번호가 없습니다.", { status: 400 });
  }
  if (!date) {
    console.error("날짜를 지정하지 않았습니다.");
    return new Response("날짜를 지정하지 않았습니다.", { status: 400 });
  }

  //사용자 정보 가져오기.
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    const note = await prisma.note.findUnique({
      where: { noteNo: Number(noteNo), userId },
    });
    if (!note || note.userId !== userId) {
      return new Response("해당 노트를 찾을 수 없거나 권한이 없습니다.", {
        status: 403,
      });
    }
    const result = await prisma.note.update({
      where: { noteNo: Number(noteNo) },
      data: { alarmDatetime: new Date(date) },
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("알림 설정에 실패했습니다. : ", err);
    return new Response("알림 설정에 실패했습니다.", { status: 500 });
  }
}
