// PrismaClient 는 DB랑 연결해주는 도구.
// 한번 만들면 앱 전체에서 사용가능함
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 전역에 prisma 라는 변수를 사용하는지 보고 없으면 새로 만든다.
export const prisma: PrismaClient = globalThis.prisma ?? new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
