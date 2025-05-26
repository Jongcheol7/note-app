import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { db } from "./note-db";
import { cookies } from "next/headers";

// Lucia 인스턴스 생성
export const lucia = new Lucia(
  new BetterSqlite3Adapter(db, {
    user: "USERS",
    session: "SESSIONS",
    key: "KEYS",
  }),
  {
    sessionCookie: {
      expires: false,
    },
    getUserAttributes: (userData) => ({
      email: userData.email,
      id: userData.id,
      picture: userData.picture,
      name: userData.name,
    }),
  }
);

// // 직접 handleRequest 함수 만들어서 export
// export const validateRequest = async () => {
//   const session = await lucia.validateSession(cookies());
//   return session;
// };
