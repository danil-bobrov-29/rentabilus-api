/*
  Warnings:

  - You are about to drop the `user_credentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_employments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_credentials" DROP CONSTRAINT "user_credentials_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_employments" DROP CONSTRAINT "user_employments_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "salary" DECIMAL(14,2),
ADD COLUMN     "taxRate" DECIMAL(5,2);

-- DropTable
DROP TABLE "user_credentials";

-- DropTable
DROP TABLE "user_employments";
