//import { selectNoteLists } from "@/lib/note-db";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    //return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = "cmb7ybvd30000v5vgn811mofv"; // session.user.id;

  try {
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
