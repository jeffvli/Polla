-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "description" VARCHAR,
ADD COLUMN     "multipleAnswers" BOOLEAN NOT NULL DEFAULT false;
