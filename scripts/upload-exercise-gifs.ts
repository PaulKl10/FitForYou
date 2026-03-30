/**
 * Script: upload-exercise-gifs.ts
 *
 * Uploads all GIF files from /media to Supabase Storage (bucket: exercises)
 * then updates the gifUrl field in the database for each exercise.
 *
 * Usage:
 *   npx tsx scripts/upload-exercise-gifs.ts
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local (required for bucket creation & uploads)
 *   - DATABASE_URL in .env.local
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const BUCKET_NAME = "exercises";
const MEDIA_DIR = path.join(process.cwd(), "media");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET_NAME);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`Bucket "${BUCKET_NAME}" created.`);
  } else {
    console.log(`Bucket "${BUCKET_NAME}" already exists.`);
  }
}

async function uploadFile(filePath: string, fileName: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `gifs/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: "image/gif",
      upsert: true,
    });

  if (error) throw new Error(`Upload failed for ${fileName}: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

  return data.publicUrl;
}

async function main() {
  await ensureBucket();

  const files = fs.readdirSync(MEDIA_DIR).filter((f) => f.endsWith(".gif"));

  console.log(`Found ${files.length} GIF files to upload.\n`);

  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  for (const fileName of files) {
    const exerciseId = path.basename(fileName, ".gif");
    const filePath = path.join(MEDIA_DIR, fileName);

    const exercise = await prisma.exercise.findFirst({
      where: { externalId: exerciseId },
      select: { id: true, gifUrl: true },
    });

    if (!exercise) {
      skipped++;
      continue;
    }

    try {
      const publicUrl = await uploadFile(filePath, fileName);

      await prisma.exercise.update({
        where: { id: exercise.id },
        data: { gifUrl: publicUrl },
      });

      uploaded++;
      if (uploaded % 50 === 0) {
        console.log(`Progress: ${uploaded}/${files.length - skipped} uploaded`);
      }
    } catch (err) {
      console.error(`  ERROR: ${err}`);
      failed++;
    }
  }

  console.log(`\nDone.`);
  console.log(`  Uploaded: ${uploaded}`);
  console.log(`  Failed:   ${failed}`);
  console.log(`  Skipped (no DB match): ${skipped}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
