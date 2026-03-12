import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const req: { categoryNo: number; sortOrder: number }[] = await request.json();

  if (!req || req.length === 0) {
    return new Response("변경할 카테고리 리스트가 없습니다.", { status: 403 });
  }

  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    //Promise.all 은 여러개를 동시에 처리할수 있도록 해줌.
    const result = await Promise.all(
      req.map((category) => {
        return prisma.category.update({
          where: {
            categoryNo: category.categoryNo,
            userId,
          },
          data: {
            sortOrder: category.sortOrder,
          },
        });
      })
    );
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("카테고리 순서변경에 실패했습니다. : ", err);
    return new Response("카테고리 순서변경에 실패했습니다.", { status: 500 });
  }
}
