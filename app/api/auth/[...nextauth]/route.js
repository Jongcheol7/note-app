import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// 프리즈마와 NextAuth 를 연결해주는 어댑터.
// NextAuth가 DB에 사용자 정보를 자동으로 저장할수 있게 해준다.
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// DB랑 연결해주는 도구이며 아래 파일에서 prisma 라고 칭하였다.
import { prisma } from "@/lib/prisma";

// 인증설정
export const authOptions = {
  //어댑터를 설정함으로써 로그인시 세션정보를 DB에 자동으로 저장해준다.
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    // 로그인 성공후 세션에 사용자 아이디를 포함시키자!
    // 그럼 프론트에서 session 이라는 것으로 쉽게 사용자 정보에 접근가능
    async session({ session, user }) {
      //session.user.id = token.sub; db 연결전에는 토큰에서 가져옴.
      session.user.id = user.id;
      return session;
    },
  },
};

// GET, POST 요청을 모두 이 핸들러로 처리하자.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
