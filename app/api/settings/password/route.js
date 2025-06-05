import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    const result = await prisma.userSettings.findUnique({
      where: { userId },
      select: { secretNotePw: true },
    });
    const hasPw = !!result?.secretNotePw;
    return Response.json({ hasPw });
  } catch (err) {
    console.error("비밀번호 조회에에 실패했습니다.", err);
    return new Response("비밀번호 조회에에 실패했습니다.", { status: 500 });
  }
}

export async function POST(request) {
  const req = await request.json();
  const currentPw = req.currentPw;
  const password = req.password;

  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 기존 비번이 있으면 그것 먼저 맞는지 확인후 새 비밀번호 세팅하자.
    if (currentPw || currentPw !== "") {
      //const hashedCurrentPw = await bcrypt.hash(currentPw, 10);
      const check = await prisma.userSettings.findUnique({
        where: { userId },
      });
      const isValid = await bcrypt.compare(currentPw, check.secretNotePw ?? "");
      if (!isValid) {
        return new Response("현재 비밀번호가 다릅니다.", { status: 403 });
      }
    }

    // 2. 비밀번호 암호화
    const hashedPw = await bcrypt.hash(password, 10);

    // 3. 기존 값이 있으면 업데이트, 없으면 새로 생성
    const result = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        secretNotePw: hashedPw,
        modDatetime: new Date(),
      },
      create: {
        userId,
        secretNotePw: hashedPw,
      },
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("비밀번호 설정에 실패했습니다.", err);
    return new Response("비밀번호 설정에 실패했습니다.", { status: 500 });
  }
}
