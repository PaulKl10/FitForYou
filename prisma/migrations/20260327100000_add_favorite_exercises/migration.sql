-- CreateTable favorite_exercises
CREATE TABLE "favorite_exercises" (
    "profile_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_exercises_pkey" PRIMARY KEY ("profile_id","exercise_id")
);

-- AddForeignKey
ALTER TABLE "favorite_exercises" ADD CONSTRAINT "favorite_exercises_profile_id_fkey"
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_exercises" ADD CONSTRAINT "favorite_exercises_exercise_id_fkey"
  FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
