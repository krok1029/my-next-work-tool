/*
  Warnings:

  - You are about to drop the `_TodoTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `targetId` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TagTargetType" AS ENUM ('TODO', 'USER');

-- DropForeignKey
ALTER TABLE "_TodoTags" DROP CONSTRAINT "_TodoTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_TodoTags" DROP CONSTRAINT "_TodoTags_B_fkey";

-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD COLUMN     "targetType" "TagTargetType" NOT NULL;

-- DropTable
DROP TABLE "_TodoTags";

-- CreateIndex
CREATE INDEX "Tag_targetType_targetId_idx" ON "Tag"("targetType", "targetId");
