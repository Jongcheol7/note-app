import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    // 리엑트쿼리로 넘겨받은 데이터 가져오기
    const { categoryName } = await request.json();
    if (!categoryName || categoryName.trim().length === 0) {
      console.error("카테고리 이름이 없습니다.");
      return new Response("카테고리 이름이 없습니다.", { status: 400 });
    }

    // 사용자 정보 가져오기
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("로그인된 유저가 아닙니다.");
      return new Response("로그인된 유저가 아닙니다.", { status: 401 });
    }
    const userId = session.user.id;

    const isExist = await prisma.category.findFirst({
      where: { userId, name: categoryName },
    });
    if (isExist) {
      console.error("이미 등록된 카테고리입니다.");
      return new Response("이미 등록된 카테고리입니다.", { status: 400 });
    }

    // 해당 유저가 가진 카테고리중 최대 sortOrder 가져와서 +1 한 상태로 저장해보자.
    const maxSortOrder = await prisma.category.aggregate({
      where: { userId },
      _max: {
        sortOrder: true,
      },
    });

    const newCategory = await prisma.category.create({
      data: {
        name: categoryName,
        userId: userId,
        sortOrder:
          maxSortOrder._max.sortOrder === null
            ? 0
            : maxSortOrder._max.sortOrder + 1,
      },
    });
    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (err) {
    console.error("카테고리 저장에 실패했습니다. : ", err);
    return new Response("카테고리 저장에 실패했습니다.", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { categoryNo } = await request.json();

  if (!categoryNo) {
    console.error("카테고리 번호가 없습니다.");
    return new Response("카테고리 번호가 없습니다.", { status: 400 });
  }

  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 소유권 확인
    const category = await prisma.category.findUnique({
      where: { categoryNo },
      select: { userId: true },
    });
    if (!category || category.userId !== userId) {
      return new Response("카테고리를 찾을 수 없거나 삭제 권한이 없습니다.", {
        status: 403,
      });
    }

    const result = await prisma.category.delete({
      where: { categoryNo },
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("카테고리 삭제에 실패했습니다. : ", err);
    return new Response("카테고리 삭제에 실패했습니다.", { status: 500 });
  }
}
