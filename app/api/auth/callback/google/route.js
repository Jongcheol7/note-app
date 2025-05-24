import { google } from "@/lib/oauth";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request) {
  //query parameter 에서 code,state 가져오기
  const url = new URL(request.url);
  //code 는 구글에서 보내는 임시인증토큰이라고 보면 된다.
  //문제 없다면 다시 구글서버에 code를 보내 진짜 정보를 얻는다(try-catch구문에서)
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  //이전에 저장된 state 쿠기 가져오기
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;

  //가져온 state 값 검증
  if (!state || !storedState || state !== storedState) {
    return new Response("유효하지 않은 state", { status: 400 });
  }
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  try {
    //구글 서버에 code 를 보내서 진짜 사용자 정보를 받아오자.
    // getExistingUser는 Lucia가 KEYS 테이블을 조회해서 해당 구글 유저에 대한 키가 이미 존재하는지 확인함
    // 있으면 유저 정보 반환, 없으면 getExistingUser는 null이 되고 우리가 createUser()로 신규 등록해야 함
    const { getExistingUser, createUser, googleUser } =
      await google.validateAuthorizationCode(code);

    //이미 가입된 유저면 그냥 정보 가져오고, 아니면 새로 가입한다.
    const user =
      getExistingUser ??
      (await createUser({
        attributes: {
          email: googleUser.email,
          name: googleUser.name,
          nick_name: googleUser.name, // 너의 USERS 테이블 기준에 맞춤
        },
      }));

    //로그인 세션 생성
    //session : 루시아가 생성한 세션객체(DB저장)
    //sessionCookie : 브라우저에 저장할 쿠키값(세션ID + 설정포함)
    const session = await lucia.createSession(user.userId, {});
    const sessionCookie = lucia.createSessionCookie(session);

    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    //로그인 최종 성공후 홈으로 리다이렉트
    return redirect("/");
  } catch (err) {
    console.error("Google OAuth 처리 중 오류 발생 : ", err);
    return new Response("Authentication failed", { status: 500 });
  }
}
