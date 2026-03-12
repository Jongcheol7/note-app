import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const {
      noteNo,
      title,
      categoryNo,
      sortOrder,
      content,
      plainText,
      color,
      isSecret,
      isPublic,
      alarmDatetime,
    } = await request.json();

    // 입력값 검증
    if (!content || content.trim().length === 0) {
      return new Response("내용이 없습니다.", { status: 400 });
    }
    if (title && title.length > 200) {
      return new Response("제목은 200자 이내로 입력해주세요.", { status: 400 });
    }
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return new Response("유효하지 않은 색상 값입니다.", { status: 400 });
    }

    // ✅ 여기가 핵심: 9시간 더해서 KST 시간 만들기
    // ✅ 날짜가 유효한 경우만 Date 생성
    let kstDate = null;
    if (alarmDatetime && !isNaN(new Date(alarmDatetime).getTime())) {
      const parsedDate = new Date(alarmDatetime);
      kstDate = new Date(parsedDate.getTime() + 9 * 60 * 60 * 1000); // KST 보정
    }

    // 사용자 정보 가져오기
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("로그인된 유저가 아닙니다.");
      return new Response("로그인된 유저가 아닙니다.", { status: 401 });
    }
    const userId = session.user.id;

    // 수정일때 !!
    if (noteNo) {
      // 소유권 확인
      const existingNote = await prisma.note.findUnique({
        where: { noteNo },
        select: { userId: true },
      });
      if (!existingNote || existingNote.userId !== userId) {
        return new Response("노트를 찾을 수 없거나 수정 권한이 없습니다.", {
          status: 403,
        });
      }

      const updateData: Record<string, unknown> = {
        title: title || "",
        content,
        plainText,
        modDatetime: new Date(),
      };

      if (categoryNo !== null && categoryNo !== undefined) {
        updateData.categoryNo = categoryNo;
      } else {
        updateData.categoryNo = null;
      }

      const updated = await prisma.note.update({
        where: { noteNo },
        data: updateData,
      });
      return new Response(JSON.stringify(updated), { status: 200 });
    }

    // 신규 추가일때 !!
    let sortOrderValue = 0;
    if (sortOrder === null) {
      // 정렬 순서가 없다면 DB에서 최대값을 가져온후 +1 해주자.
      const maxSortOrder = await prisma.note.aggregate({
        where: { userId },
        _max: {
          sortOrder: true,
        },
      });
      sortOrderValue =
        maxSortOrder._max.sortOrder === null
          ? 0
          : maxSortOrder._max.sortOrder + 1;
    }

    const newNote = await prisma.note.create({
      data: {
        userId,
        title: title || "", // 제목 없을 수도 있으니 기본값 빈 문자열
        content,
        plainText,
        categoryNo: categoryNo || null,
        color,
        isSecret,
        isPublic,
        alarmDatetime: kstDate,
        sortOrder: sortOrder ?? sortOrderValue,
        modDatetime: new Date(),
      },
    });

    return new Response(JSON.stringify(newNote), { status: 201 });
  } catch (err) {
    console.error("메모 저장에 실패했습니다. : ", err);
    return new Response("메모 저장에 실패했습니다.", { status: 500 });
  }
}
