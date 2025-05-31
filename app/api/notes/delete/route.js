import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  try {
    const req = await request.json();
    const noteNo = req.noteNo;
    if (!noteNo) {
      console.error("노트 번호가 없습니다.");
      return new Response("노트 번호가 없습니다.", { status: 401 });
    }

    // 사용자 정보 가져오기
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("로그인된 유저가 아닙니다.");
      return new Response("로그인된 유저가 아닙니다.", { status: 401 });
    }

    const deleted = await prisma.note.update({
      where: { noteNo },
      data: {
        delDatetime: new Date(),
      },
    });
    return new Response(JSON.stringify(deleted), { status: 200 });
  } catch (err) {
    console.error("메모 삭제에 실패했습니다. : ", err);
    return new Response("메모 삭제에 실패했습니다.", { status: 500 });
  }
}
