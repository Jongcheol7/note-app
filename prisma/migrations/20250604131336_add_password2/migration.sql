/*
  Warnings:

  - You are about to drop the column `password` on the `note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "note" DROP COLUMN "password",
ADD COLUMN     "isSecret" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserSettings" (
    "userId" TEXT NOT NULL,
    "secretNotePw" TEXT,
    "inputDatetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modDatetime" TIMESTAMP(3),

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
