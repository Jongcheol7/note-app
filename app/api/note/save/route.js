import { lucia } from "@/lib/auth";
import { insertCategory, insertNote } from "@/lib/note-db";
import { cookies } from "next/headers";

export async function POST(requset) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;
  const session = await lucia.validateSession(sessionId);
  if (!session) {
    return new Response("로그인 세션 정보가 없습니다.", { status: 401 });
  }
  const { title, content } = await requset.json();
  console.log("title : ", title);
  console.log("content : ", content);
  if (!content || content.trim().length === 0) {
    return new Response("내용이 비어있습니다.", { status: 401 });
  }
  try {
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
  } catch (err) {
    console.error("❌ insertNote 에러:", err); // 꼭 찍자!
    return new Response("저장 실패패.", { status: 500 });
  }
}
