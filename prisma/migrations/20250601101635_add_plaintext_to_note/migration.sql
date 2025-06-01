/*
  Warnings:

  - Made the column `plainText` on table `note` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "note" ALTER COLUMN "plainText" SET NOT NULL;
