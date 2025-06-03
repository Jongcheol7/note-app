/*
  Warnings:

  - You are about to drop the column `thumnail` on the `note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "note" DROP COLUMN "thumnail";

-- CreateTable
CREATE TABLE "tags" (
    "name" TEXT NOT NULL,
    "noteNo" INTEGER NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("name","noteNo")
);

-- CreateTable
CREATE TABLE "like" (
    "userId" TEXT NOT NULL,
    "noteNo" INTEGER NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("userId","noteNo")
);

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_noteNo_fkey" FOREIGN KEY ("noteNo") REFERENCES "note"("noteNo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_noteNo_fkey" FOREIGN KEY ("noteNo") REFERENCES "note"("noteNo") ON DELETE CASCADE ON UPDATE CASCADE;
