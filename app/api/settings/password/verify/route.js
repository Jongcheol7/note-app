import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

export async function POST(request) {
  const req = await request.json();
  const password = req.password;

  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    const check = await prisma.userSettings.findUnique({
      where: { userId },
    });
    const isValid = await bcrypt.compare(password, check.secretNotePw ?? "");
    if (!isValid) {
      return new Response("비밀번호가 틀립니다.", { status: 403 });
    }
    return new Response(JSON.stringify(isValid), { status: 200 });
  } catch (err) {
    console.error("비밀번호 확인에 실패했습니다.", err);
    return new Response("비밀번호 확인에 실패했습니다.", { status: 500 });
  }
}
