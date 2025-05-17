/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "needPasswordChange" BOOLEAN DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Author_userId_key" ON "Author"("userId");
