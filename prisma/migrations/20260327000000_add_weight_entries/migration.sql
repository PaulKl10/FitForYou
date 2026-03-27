-- CreateTable weight_entries
CREATE TABLE "weight_entries" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "weight_entries" ADD CONSTRAINT "weight_entries_profile_id_fkey"
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
