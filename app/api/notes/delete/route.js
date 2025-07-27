import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function DELETE(request) {
  const req = await request.json();
  const noteNo = req.noteNo;
  if (!noteNo) {
    console.error("노트 번호가 없습니다.");
    return NextResponse.json(
      { error: "노트 번호가 없습니다." },
      { status: 400 }
    );
  }

  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인된 유저가 아닙니다.");
    return NextResponse.json(
      { error: "로그인된 유저가 아닙니다." },
      { status: 401 }
    );
  }
  const userId = session.user.id;

  try {
    // 먼저 노트가 존재하는지, 그리고 내 노트인지 확인
    const note = await prisma.note.findUnique({
      where: { noteNo },
    });

    if (!note || note.userId !== userId) {
      return NextResponse.json(
        { error: "해당 노트를 찾을 수 없거나 권한이 없습니다." },
        { status: 403 }
      );
    }

    // S3 에 사진을 제거해보자.
    const matches = [...note.content.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g)];
    console.log("note : ", note);
    console.log("matches : ", matches);
    console.log(
      "matches: ",
      matches.map((m) => m[1])
    );

    const cloudfrontUrl = process.env.CLOUDFRONT_DOMAIN_NAME;
    console.log("cloudfrontUrl :", cloudfrontUrl);
    const s3Keys = matches
      .map((m) => m[1]) // src 값만
      .filter((src) => src.startsWith(cloudfrontUrl))
      .map((src) => ({
        Key: src.split("/").pop(),
      }));

    console.log("s3Keys :", s3Keys);
    if (s3Keys.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: s3Keys },
        })
      );
    }
    const deleted = await prisma.note.update({
      where: { noteNo },
      data: {
        delDatetime: new Date(),
      },
    });
    return NextResponse.json(
      { success: "메모 삭제 성공", data: JSON.stringify(deleted) },
      { status: 200 }
    );
  } catch (err) {
    console.error("메모 삭제에 실패했습니다. : ", err);
    return NextResponse.json(
      { error: "메모 삭제에 실패했습니다." },
      { status: 200 }
    );
  }
}
