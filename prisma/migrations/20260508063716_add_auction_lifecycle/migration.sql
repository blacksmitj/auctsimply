-- AlterTable
ALTER TABLE "items" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "winner_id" TEXT;
