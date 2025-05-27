-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "opinionId" TEXT,
ADD COLUMN     "videoNewsId" TEXT;

-- CreateTable
CREATE TABLE "Opinion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoNews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT,
    "isVideoNews" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OpinionTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OpinionTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_VideoNewsTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VideoNewsTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opinion_slug_key" ON "Opinion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VideoNews_slug_key" ON "VideoNews"("slug");

-- CreateIndex
CREATE INDEX "_OpinionTags_B_index" ON "_OpinionTags"("B");

-- CreateIndex
CREATE INDEX "_VideoNewsTags_B_index" ON "_VideoNewsTags"("B");

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoNews" ADD CONSTRAINT "VideoNews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoNews" ADD CONSTRAINT "VideoNews_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_opinionId_fkey" FOREIGN KEY ("opinionId") REFERENCES "Opinion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_videoNewsId_fkey" FOREIGN KEY ("videoNewsId") REFERENCES "VideoNews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OpinionTags" ADD CONSTRAINT "_OpinionTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Opinion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OpinionTags" ADD CONSTRAINT "_OpinionTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoNewsTags" ADD CONSTRAINT "_VideoNewsTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoNewsTags" ADD CONSTRAINT "_VideoNewsTags_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoNews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
