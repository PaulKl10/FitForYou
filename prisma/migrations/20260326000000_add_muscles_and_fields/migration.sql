-- AlterTable exercises: make equipment nullable, add new columns
-- Table is empty at this point so NOT NULL without DEFAULT is valid
ALTER TABLE "exercises"
  ALTER COLUMN "equipment" DROP NOT NULL,
  ADD COLUMN "external_id" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "category" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "level" TEXT,
  ADD COLUMN "force" TEXT,
  ADD COLUMN "mechanic" TEXT;

-- Remove the temporary defaults (columns stay NOT NULL)
ALTER TABLE "exercises"
  ALTER COLUMN "external_id" DROP DEFAULT,
  ALTER COLUMN "category" DROP DEFAULT;

-- CreateUniqueIndex on external_id
CREATE UNIQUE INDEX "exercises_external_id_key" ON "exercises"("external_id");

-- CreateTable muscles
CREATE TABLE "muscles" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "muscles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "muscles_name_key" ON "muscles"("name");

-- CreateTable exercise_muscles
CREATE TABLE "exercise_muscles" (
  "exercise_id" TEXT NOT NULL,
  "muscle_id" TEXT NOT NULL,
  "is_primary" BOOLEAN NOT NULL,
  CONSTRAINT "exercise_muscles_pkey" PRIMARY KEY ("exercise_id", "muscle_id")
);

-- AddForeignKey
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_exercise_id_fkey"
  FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_muscle_id_fkey"
  FOREIGN KEY ("muscle_id") REFERENCES "muscles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
