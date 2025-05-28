# 🔐 Google OAuth 로그인 흐름 정리 (Lucia + Next.js)

이 프로젝트는 Next.js와 Lucia를 기반으로 Google OAuth 로그인 기능을 구현하고 있습니다.  
전체 흐름은 다음과 같이 구성되어 있습니다.

---

## 1. `auth.js` – Lucia 인증 객체 설정

`auth.js`에서는 Lucia 객체를 생성하고, 사용할 데이터베이스 테이블을 매핑합니다.  
SQLite를 사용하며, `USERS`, `KEYS`, `SESSIONS` 테이블을 각각 사용자 정보, 로그인 수단, 세션 정보 테이블로 설정합니다.  
Lucia는 `getUserAttributes()`를 통해 테이블의 컬럼명을 실제 코드에서 사용할 이름으로 변환합니다.  
예를 들어, DB에는 `user_id` 컬럼이 있지만 코드에서는 `user.userId`로 사용할 수 있도록 매핑합니다.

---

## 2. `oauth.js` – Google OAuth provider 설정

`oauth.js`는 Lucia에서 사용할 Google OAuth provider를 설정하는 파일입니다.  
Google Cloud Console에서 발급받은 Client ID, Client Secret, 그리고 Redirect URI를 등록합니다.  
이 값들은 `.env.local` 파일에 저장되어 있으며, 실제 로그인 요청과 콜백 처리 시 사용됩니다.

---

## 3. `/api/auth/callback/google` – 로그인 완료 후 콜백 처리

이 경로는 구글 로그인 완료 후 사용자가 리디렉션되어 도착하는 콜백 처리 지점입니다.  
구글이 전달한 `code`와 `state` 값을 받아, 먼저 쿠키에 저장된 state 값과 비교하여 CSRF 공격을 방지합니다.  
그 다음 Lucia의 `validateAuthorizationCode(code)`를 호출하여 구글 사용자 정보를 받아오고,  
해당 사용자가 이미 등록된 유저라면 그대로 사용하고, 등록되지 않았다면 Lucia가 `USERS`와 `KEYS` 테이블에 자동으로 신규 유저를 insert합니다.  
이후 `createSession()`으로 로그인 세션을 생성하고, 이를 쿠키로 만들어 브라우저에 저장합니다.  
최종적으로 로그인에 성공하면 홈(`/`)으로 리다이렉트됩니다.

---

## 3-1. `/api/auth/google` – Google 로그인 시작 요청

이 경로는 사용자가 “구글로 로그인” 버튼을 눌렀을 때 처음 호출되는 로그인 시작 지점입니다.  
서버는 먼저 CSRF 방지를 위한 임의의 `state` 값을 생성하고, 이 값을 쿠키에 저장합니다.  
그 후 Lucia의 Google provider를 통해 로그인 URL을 생성하며, 이 URL에는 client ID, redirect URI, scope, state 등이 자동으로 포함됩니다.  
마지막으로 서버는 해당 로그인 URL로 사용자를 리다이렉트시켜 구글 로그인 페이지로 이동시킵니다.  
이 흐름을 통해 보안이 강화된 상태에서 구글 로그인을 시작할 수 있습니다.

## 4. 세션과 쿠키

Lucia는 `createSession()`을 통해 DB에 세션 정보를 저장하고,  
`createSessionCookie()`를 통해 브라우저에 저장할 세션 쿠키를 생성합니다.  
이 쿠키는 `auth_session`이라는 이름으로 저장되며, 이후 인증된 요청마다 이 값을 통해 로그인 상태를 유지할 수 있습니다.

---

## 5. 전체 흐름 요약

1. 사용자가 구글 로그인 버튼을 클릭하면 `/api/auth/google`로 요청 → 구글 로그인 페이지로 리다이렉트됩니다.
2. 사용자가 로그인에 성공하면 구글이 `/api/auth/callback/google?code=...&state=...` 형식으로 우리 서버에 요청을 보냅니다.
3. 서버는 state 값 검증 후, 구글로부터 사용자 정보를 받아오고 기존 유저 여부를 확인합니다.
4. 유저가 존재하지 않으면 Lucia가 자동으로 `USERS`와 `KEYS` 테이블에 신규 등록합니다.
5. 세션을 생성하고 브라우저에 쿠키를 설정한 뒤, 로그인 완료 후 홈으로 이동시킵니다.

---

## 💡 확장성

Lucia는 Kakao, Naver 등 다른 OAuth provider도 유사한 방식으로 추가할 수 있으며,  
Google 외에도 다양한 로그인 방식을 통합 관리할 수 있도록 설계되어 있습니다.

## npx prisma studio 로 db 직접 확인가능

## npm 패키지 버전보는법 npm view @lucia-auth/adapter-prisma versions
