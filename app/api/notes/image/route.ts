import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "로그인된 유저가 아닙니다." },
      { status: 401 }
    );
  }

  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return NextResponse.json(
      { error: "이미지 URL이 없습니다." },
      { status: 400 }
    );
  }

  const s3Key = imageUrl.split("/").pop();

  try {
    if (s3Key) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket,
          Key: s3Key,
        })
      );
    }
    return NextResponse.json({ success: "사진 삭제 성공" }, { status: 200 });
  } catch (err) {
    console.error("S3 삭제 실패:", err);
    return NextResponse.json({ error: "사진 삭제 실패" }, { status: 500 });
  }
}
