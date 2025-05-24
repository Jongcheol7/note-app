import { Lucia } from "lucia";
import { sqliteAdapter } from "@lucia-auth/adapter-sqlite";
import { db } from "./note-db";

//루시아 인증 객체를 생성하면서 옵션(db, 사용자설정)을 넣어주도록 한다.
export const lucia = new Lucia(
  //첫번째 옵션 : 루시아가 사용할 db 테이블을 지정하고 user,key,session 으로 매핑한다.
  sqliteAdapter(db, {
    user: "USERS",
    key: "KEYS",
    session: "SESSIONS",
  }),
  {
    //세션쿠키를 영구보관하지 않고 브라우저 종료시 만료되도록 설정.
    sessionCookie: {
      expires: false,
    },

    //두번째 옵션: USERS 테이블에서 가져온 데이터를 data라고 칭하고
    //그 안의 컬럼들을 클라이언트에서 사용할 속성 이름으로 변환한다.
    getUserAttributes: (data) => ({
      userId: data.user_id,
      email: data.email,
      name: data.name,
      nickName: data.nick_name,
    }),
  }
);
