/*
  Warnings:

  - The primary key for the `like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,noteNo]` on the table `like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,noteNo]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "like" DROP CONSTRAINT "like_pkey",
ADD COLUMN     "inputDatetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "likeNo" SERIAL NOT NULL,
ADD CONSTRAINT "like_pkey" PRIMARY KEY ("likeNo");

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pkey",
ADD COLUMN     "inputDatetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tagNo" SERIAL NOT NULL,
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("tagNo");

-- CreateIndex
CREATE UNIQUE INDEX "like_userId_noteNo_key" ON "like"("userId", "noteNo");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_noteNo_key" ON "tags"("name", "noteNo");
