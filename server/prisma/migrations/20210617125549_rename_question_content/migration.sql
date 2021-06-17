/*
  Warnings:

  - You are about to drop the column `content` on the `PollQuestion` table. All the data in the column will be lost.
  - Added the required column `question` to the `PollQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PollQuestion" DROP COLUMN "content",
ADD COLUMN     "question" VARCHAR(200) NOT NULL;
