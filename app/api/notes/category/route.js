import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("로그인된 유저가 아닙니다.", { status: 401 });
  }
  const userId = session.user.id;

  const categories = await prisma.category.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return Response.json(categories);
}
