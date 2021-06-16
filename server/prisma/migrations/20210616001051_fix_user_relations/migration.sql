/*
  Warnings:

  - You are about to drop the column `userId` on the `Poll` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Poll` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_userId_fkey";

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "userId",
ADD COLUMN     "username" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Poll.username_unique" ON "Poll"("username");

-- AddForeignKey
ALTER TABLE "Poll" ADD FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
