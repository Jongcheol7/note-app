import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  if (!year || !month) {
    return new Response("연도와 월이 필요합니다.", { status: 400 });
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59); // 해당 월 마지막날

  const notes = await prisma.note.findMany({
    where: {
      userId,
      alarmDatetime: {
        gte: start,
        lte: end,
      },
    },
    select: {
      noteNo: true,
      title: true,
      alarmDatetime: true,
    },
  });

  return new Response(JSON.stringify(notes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(request) {
  const req = await request.json();
  const { date, no: noteNo } = req;

  if (!noteNo || !date) {
    return new Response("노트 번호 또는 날짜가 없습니다.", { status: 400 });
  }

  // ✅ 여기가 핵심: 9시간 더해서 KST 시간 만들기
  const parsedDate = new Date(date);
  const kstDate = new Date(parsedDate.getTime() + 9 * 60 * 60 * 1000);

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    const note = await prisma.note.findUnique({
      where: { noteNo: Number(noteNo), userId },
    });

    if (!note) {
      return new Response("해당 노트를 찾을 수 없습니다.", { status: 404 });
    }

    const result = await prisma.note.update({
      where: { noteNo: Number(noteNo) },
      data: { alarmDatetime: kstDate }, // ✅ KST로 맞춰 저장
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("알림 설정 실패:", err);
    return new Response("알림 설정에 실패했습니다.", { status: 500 });
  }
}
