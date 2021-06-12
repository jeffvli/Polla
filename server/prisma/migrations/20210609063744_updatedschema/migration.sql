/*
  Warnings:

  - You are about to drop the `Choice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_choiceId_fkey";

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Choice";

-- DropTable
DROP TABLE "Response";

-- CreateTable
CREATE TABLE "PollQuestion" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "pollId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollResponse" (
    "id" SERIAL NOT NULL,
    "ipAddress" VARCHAR(45) NOT NULL,
    "response" BOOLEAN NOT NULL DEFAULT false,
    "pollId" INTEGER NOT NULL,
    "pollQuestionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PollQuestion.pollId_unique" ON "PollQuestion"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "PollResponse.pollId_unique" ON "PollResponse"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "PollResponse.pollQuestionId_unique" ON "PollResponse"("pollQuestionId");

-- AddForeignKey
ALTER TABLE "PollQuestion" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollResponse" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollResponse" ADD FOREIGN KEY ("pollQuestionId") REFERENCES "PollQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
