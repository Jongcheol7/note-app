import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// .env.local에 GOOGLE_CLIENT_ID 설정되어 있어야 함
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Google 로그인 완료 후 돌아올 URI
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/google";

export async function GET() {
  // CSRF 방지용 state 값 생성
  const state = crypto.randomUUID();

  // 상태값을 쿠키에 저장 (나중에 callback에서 확인)
  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10분 유효
  });

  // 구글 로그인 URL 생성
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);

  // 사용자를 구글 로그인 페이지로 리다이렉트
  return NextResponse.redirect(url.toString());
}
