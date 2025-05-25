// Lucia 본체를 불러온다 (세션 관리용)
import { Lucia } from "lucia";

// Lucia v3는 어댑터를 함수로 직접 설정해야 하며,
// better-sqlite3를 위한 공식 어댑터 함수는 이 경로에서 가져온다.
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";

// better-sqlite3 DB 인스턴스를 불러온다
// (너가 이미 사용 중인 blog-db.js 또는 db.js에서 export한 인스턴스)
import { db } from "./note-db";

// Lucia 인스턴스를 생성한다.
// 첫 번째 인자는 DB 어댑터 설정
// 두 번째 인자는 Lucia의 세션 쿠키, 유저 데이터 반환 방식 설정
export const lucia = new Lucia(
  new BetterSqlite3Adapter(db, {
    user: "USERS", // 유저 테이블 이름
    session: "SESSIONS", // 세션 테이블 이름
    key: "KEYS",
  }),
  {
    sessionCookie: {
      // 세션 쿠키를 영구 보관하지 않고 브라우저 종료 시 만료되도록 설정
      expires: false,
    },
    // 유저 데이터를 세션에 포함시킬 때 어떤 속성을 넘길지 정의
    // db 테이블에서 가져온다.
    getUserAttributes: (userData) => {
      console.log("🔍 Raw userData from DB:", userData);
      return {
        email: userData.email,
        id: userData.id,
        picture: userData.picture,
        name: userData.name,
      };
    },
  }
);
