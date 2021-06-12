-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "pollId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "choiceId" INTEGER NOT NULL,
    "ipAddress" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Choice.pollId_unique" ON "Choice"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "Response.choiceId_unique" ON "Response"("choiceId");

-- AddForeignKey
ALTER TABLE "Choice" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD FOREIGN KEY ("choiceId") REFERENCES "Choice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
