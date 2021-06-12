/*
  Warnings:

  - You are about to alter the column `description` on the `Poll` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(400)`.
  - You are about to alter the column `content` on the `PollQuestion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Poll" ALTER COLUMN "description" SET DATA TYPE VARCHAR(400);

-- AlterTable
ALTER TABLE "PollQuestion" ALTER COLUMN "content" SET DATA TYPE VARCHAR(200);
