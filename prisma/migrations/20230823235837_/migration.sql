/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseEndDate` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseID` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseStartDate` on the `Course` table. All the data in the column will be lost.
  - The primary key for the `Lecture` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lectureEndDate` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `lectureID` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `lectureStartDate` on the `Lecture` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Lecture` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `StartDate` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EndDate` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StartDate` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` DROP PRIMARY KEY,
    DROP COLUMN `courseEndDate`,
    DROP COLUMN `courseID`,
    DROP COLUMN `courseStartDate`,
    ADD COLUMN `EndDate` DATETIME(3) NULL,
    ADD COLUMN `StartDate` DATETIME(3) NOT NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Lecture` DROP PRIMARY KEY,
    DROP COLUMN `lectureEndDate`,
    DROP COLUMN `lectureID`,
    DROP COLUMN `lectureStartDate`,
    ADD COLUMN `EndDate` DATETIME(3) NOT NULL,
    ADD COLUMN `StartDate` DATETIME(3) NOT NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `userID`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `firstName` VARCHAR(255) NOT NULL DEFAULT 'null',
    MODIFY `lastName` VARCHAR(255) NOT NULL DEFAULT 'null',
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Course_id_key` ON `Course`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Lecture_id_key` ON `Lecture`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);
