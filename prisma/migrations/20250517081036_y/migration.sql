/*
  Warnings:

  - Added the required column `newType` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SetNewsType" AS ENUM ('WORLD', 'NATIONAL', 'SPORTS', 'SCIENCE', 'EDUCATION');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "newType" "SetNewsType" NOT NULL;
