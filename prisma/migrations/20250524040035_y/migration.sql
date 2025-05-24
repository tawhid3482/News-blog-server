-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "readingTime" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "PostView" ADD COLUMN     "readingTime" INTEGER;

-- CreateIndex
CREATE INDEX "PostView_postId_idx" ON "PostView"("postId");

-- CreateIndex
CREATE INDEX "PostView_userId_idx" ON "PostView"("userId");
