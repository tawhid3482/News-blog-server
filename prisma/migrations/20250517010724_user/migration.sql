/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Editor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Editor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Editor" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Editor_userId_key" ON "Editor"("userId");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
