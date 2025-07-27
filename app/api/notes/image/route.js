import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(requset) {
  const { imageUrl } = await requset.json();
  console.log(imageUrl);

  const s3Key = imageUrl.split("/").pop();
  console.log("추출된 S3 Key:", s3Key);

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
