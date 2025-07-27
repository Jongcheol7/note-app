import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const { fileType } = await request.json();

    //업로드될 파일 이름(중복방지로 랜덤값 부여)
    const fileName = `${randomUUID()}.${fileType.split("/")[1]}`;

    const command = new PutObjectCommand({
      Bucket: Bucket,
      Key: fileName,
      ContentType: fileType,
    });

    //60초 유효한 presigned URL 생성
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({
      uploadUrl: url,
      //fileUrl: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      fileUrl: `${process.env.CLOUDFRONT_DOMAIN_NAME}/${fileName}`,
    });
  } catch (err) {
    console.error("Presigned URL 생성 실패 : ", err);
    return NextResponse.json(
      { error: "Presigned URL 생성 실패" },
      { status: 500 }
    );
  }
}
