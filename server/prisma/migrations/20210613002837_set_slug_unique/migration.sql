/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Poll` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Poll.slug_unique" ON "Poll"("slug");
