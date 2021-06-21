/*
  Warnings:

  - Added the required column `dupCheckMode` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "dupCheckMode" VARCHAR(10) NOT NULL;
