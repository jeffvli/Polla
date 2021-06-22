/*
  Warnings:

  - You are about to alter the column `title` on the `Poll` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(128)`.
  - You are about to alter the column `description` on the `Poll` table. The data in that column could be lost. The data in that column will be cast from `VarChar(400)` to `VarChar(256)`.

*/
-- AlterTable
ALTER TABLE "Poll" ALTER COLUMN "title" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(256);
