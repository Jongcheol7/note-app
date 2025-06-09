//import { insertCategory, insertNote } from "@/lib/note-db";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function POST(requset) {
  try {
    // 리엑트쿼리로 넘겨받은 데이터 가져오기
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
    } = await requset.json();
    if (!content || content.trim().length === 0) {
      console.error("내용이 없습니다.");
      return new Response("내용이 없습니다.", { status: 401 });
    }

    // ✅ 여기가 핵심: 9시간 더해서 KST 시간 만들기
    // ✅ 날짜가 유효한 경우만 Date 생성
    let kstDate = null;
    if (alarmDatetime && !isNaN(new Date(alarmDatetime))) {
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
      const updated = await prisma.note.update({
        where: { noteNo },
        data: {
          user: { connect: { id: userId } },
          title: title || "",
          content,
          plainText,
          category: { connect: { categoryNo: categoryNo } },
          modDatetime: new Date(),
        },
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
        categoryNo,
        color,
        isSecret,
        isPublic,
        alarmDatetime: kstDate,
        sortOrder: sortOrder ?? sortOrderValue,
      },
    });

    return new Response(JSON.stringify(newNote), { status: 201 });
  } catch (err) {
    console.error("메모 저장에 실패했습니다. : ", err);
    return new Response("메모 저장에 실패했습니다.", { status: 500 });
  }
}
