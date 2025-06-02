import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(requset) {
  const req = await requset.json();

  const isPublic = req.isPublic;
  const noteNo = req.noteNo;

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
    const note = await prisma.note.findUnique({
      where: { noteNo },
    });
    if (!note || note.userId !== userId) {
      return new Response("해당 노트를 찾을 수 없거나 권한이 없습니다.", {
        status: 403,
      });
    }

    const updated = await prisma.note.update({
      where: { noteNo },
      data: { isPublic },
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("공개여부 변경에에 실패했습니다. : ", err);
    return new Response("공개여부부 변경에에 실패했습니다.", { status: 500 });
  }

  return new Response("공개 업데이트 성공", { status: 500 });
}
