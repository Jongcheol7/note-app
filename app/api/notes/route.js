//import { selectNoteLists } from "@/lib/note-db";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  //const notes = await selectNoteLists(userId); sqlite 버전
  const notes = await prisma.note.findMany({
    where: {
      userId: userId,
      delDatetime: null,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return Response.json(notes);
}
