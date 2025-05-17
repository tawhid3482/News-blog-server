/*
  Warnings:

  - You are about to drop the column `newType` on the `Post` table. All the data in the column will be lost.
  - Changed the type of `name` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "name" "SetNewsType" NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "newType";

-- RenameForeignKey
ALTER TABLE "Post" RENAME CONSTRAINT "Post_categoryId_fkey" TO "fk_post_category";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "fk_post_author" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
