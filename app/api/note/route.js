import { lucia } from "@/lib/auth";
import { selectNoteLists } from "@/lib/note-db";
import { cookies } from "next/headers";

export async function GET() {
  // 로그인 세션을 루시아로 확인 (쿠키 안에 세션 ID가 있음) 즉 쿠키 기반 인증
  const cookieStore = await cookies();
  //const session = await validateRequest(cookieStore);
  console.log(cookieStore.get("auth_session"));
  console.log(cookieStore.get("auth_session"));
  const session = await lucia.validateSession(cookieStore);
  console.log("✅ 세션:", session);
  if (!session) {
    return new Response("세션 정보가 없습니다. 조회 실패", { status: 401 });
  }
  const userId = session.user.id;
  console.log("userId : ", userId);
  const notes = await selectNoteLists(userId);
  return Response.json(notes);
}
