-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorAuthorId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorAuthorId_fkey" FOREIGN KEY ("authorAuthorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;
