import { lucia } from "@/lib/auth";
import { insertCategory, insertNote } from "@/lib/note-db";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(requset) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  const session = await lucia.validateSession(sessionId);
  if (!session) {
    return new Response("로그인 세션 정보가 없습니다.", { status: 401 });
  }
  const userId = session.user.id;

  const { title, content } = await requset.json();
  console.log("title : ", title);
  console.log("content : ", content);
  if (!content || content.trim().length === 0) {
    return new Response("내용이 비어있습니다.", { status: 401 });
  }
  try {
    let category = await prisma.category.findFirst({
      where: {
        userId: userId,
        name: "기본 카테고리",
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "기본 카테고리",
          userId: userId,
          sortOrder: 0,
        },
      });
    }

    const newNote = await prisma.note.create({
      data: {
        userId: userId,
        title: title || "", // 제목 없을 수도 있으니 기본값 빈 문자열
        content: content,
        thumnail: "", // 썸네일은 지금은 빈 값
        categoryNo: category.categoryNo,
        sortOrder: 0,
      },
    });

    return Response.json({ message: "작성 성공", id: newNote.noteNo });

    /* sqlite 버전
    // 여기서 db에 저장해보자
    await insertCategory({
      name: "기본 카테고리",
      user_id: session.user.id,
      sort_order: 0,
    });
    const result = await insertNote({
      user_id: session.user.id,
      title,
      content, // ✅ 빠뜨리지 말고 넣어주기
      thumnail: "",
      category_no: 1,
      sort_order: 0,
    });
    return Response.json({ message: "작성 성공", id: result.noteId });
    */
  } catch (err) {
    console.error("❌ insertNote 에러:", err); // 꼭 찍자!
    return new Response("저장 실패패.", { status: 500 });
  }
}
