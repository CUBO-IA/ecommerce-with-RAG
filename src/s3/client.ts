import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../const";

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

export const s3 = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY
  }
});

export async function uploadImage(file: File): Promise<string> {
  const ext = IMAGE_EXTENSIONS[file.type];
  if (!ext) throw new Error(`Tipo de imagen no soportado: ${file.type}`);

  const key = `${crypto.randomUUID()}.${ext}`;
  await s3.send(new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: new Uint8Array(await file.arrayBuffer()),
    ContentType: file.type
  }));
  return key;
}

export async function deleteImage(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
}

export function imageUrl(key: string): string {
  return `${env.S3_PUBLIC_URL}/${key}`;
}
