/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `name`,
    MODIFY `userType` ENUM('Admin', 'Student', 'Professor') NULL,
    MODIFY `GPA` DOUBLE NULL,
    MODIFY `age` INTEGER NULL,
    MODIFY `gender` VARCHAR(191) NULL,
    MODIFY `lecturesAttended` INTEGER NULL,
    MODIFY `totalLectures` INTEGER NULL,
    ADD PRIMARY KEY (`email`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
