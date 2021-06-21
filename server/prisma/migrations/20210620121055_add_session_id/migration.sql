-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "sessionId" VARCHAR(24);

-- AlterTable
ALTER TABLE "PollResponse" ADD COLUMN     "sessionId" VARCHAR(24);
