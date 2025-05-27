import { lucia } from "@/lib/auth";
import { selectNoteLists } from "@/lib/note-db";
import { cookies } from "next/headers";

export async function GET() {
  // 로그인 세션을 루시아로 확인 (쿠키 안에 세션 ID가 있음) 즉 쿠키 기반 인증
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  const session = await lucia.validateSession(sessionId);
  if (!session) {
    return new Response("세션 정보가 없습니다. 조회 실패", { status: 401 });
  }
  const userId = session.user.id;
  const notes = await selectNoteLists(userId);
  return Response.json(notes);
}
