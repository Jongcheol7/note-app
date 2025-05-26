// Google 로그인 시작 및 로그아웃 처리 API
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";

// 환경변수에 저장한 Google 클라이언트 ID
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// Google 로그인 완료 후 돌아올 리다이렉트 URI
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/google";

// ✅ 로그인
export async function GET() {
  // 해커공격 방지용(CSRF 방지용) state 값 생성
  const state = crypto.randomUUID();

  // 상태값을 쿠키에 저장 (나중에 callback에서 확인)
  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true, //자바스크립트에서 접근 못하도록함
    secure: process.env.NODE_ENV === "production", //운영환경일때만 HTTPS 프로토콜
    maxAge: 60 * 10, // 유효시간 10분
  });

  // 구글 로그인 URL 생성 (url 뒤에 붙는 파라미터들)
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);

  // 사용자를 구글 로그인 페이지로 리다이렉트
  return NextResponse.redirect(url.toString());
}
