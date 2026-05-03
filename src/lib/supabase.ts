import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const region = process.env.SUPABASE_REGION!;
const accessKeyId = process.env.SUPABASE_KEY_ID!;
const secretAccessKey = process.env.SUPABASE_ACCESS_KEY!;

// S3-compatible client for Supabase Storage
export const s3Client = new S3Client({
  forcePathStyle: true, // Required for Supabase S3
  region: region,
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET!;
