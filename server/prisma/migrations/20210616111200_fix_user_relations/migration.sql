/*
  Warnings:

  - You are about to drop the column `userId` on the `PollResponse` table. All the data in the column will be lost.
  - You are about to drop the column `pollId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PollResponse" DROP CONSTRAINT "PollResponse_userId_fkey";

-- AlterTable
ALTER TABLE "PollResponse" DROP COLUMN "userId",
ADD COLUMN     "username" VARCHAR(20);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pollId";

-- AddForeignKey
ALTER TABLE "PollResponse" ADD FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
