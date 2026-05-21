/*
  Warnings:

  - You are about to drop the column `categorieName` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `categorieId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `creadedAt` on the `Task` table. All the data in the column will be lost.
  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `categoryName` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_categorieId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "categorieName",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "categorieId",
DROP COLUMN "creadedAt",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
