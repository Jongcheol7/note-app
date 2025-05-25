import { lucia } from "./auth";
//import { getUserNickName } from "./blog-db";
import { cookies } from "next/headers";

export default async function UserSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  // 세션 ID 없으면 로그인 안 된 상태
  if (!sessionId) return null;

  // Lucia로 세션 검증
  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user) return null;

  // 닉네임 가져오기 (DB)
  //   const nickNameRes = await getUserNickName(user.id);
  //   const nickName = nickNameRes?.nick_name ?? "이름없음";

  // 유저 정보 객체로 반환
  return {
    user,
    //...user,
    //nickName,
  };
}
