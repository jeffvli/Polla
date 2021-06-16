/*
  Warnings:

  - Added the required column `userId` to the `PollResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PollResponse" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pollId" INTEGER;

-- AddForeignKey
ALTER TABLE "PollResponse" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;
