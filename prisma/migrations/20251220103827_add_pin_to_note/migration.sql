-- AlterTable
ALTER TABLE "note" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pinDatetime" TIMESTAMP(3);
