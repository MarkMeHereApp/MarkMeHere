-- CreateTable
CREATE TABLE `User` (
    `userID` VARCHAR(191) NOT NULL,
    `userType` ENUM('Admin', 'Student', 'Professor') NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `GPA` DOUBLE NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `lecturesAttended` INTEGER NOT NULL,
    `totalLectures` INTEGER NOT NULL,

    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lecture` (
    `lectureID` VARCHAR(191) NOT NULL,
    `lectureStartDate` DATETIME(3) NOT NULL,
    `lectureEndDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`lectureID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `courseID` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL,
    `courseStartDate` DATETIME(3) NOT NULL,
    `courseEndDate` DATETIME(3) NULL,

    PRIMARY KEY (`courseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_User_LecturesAttendance` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_User_LecturesAttendance_AB_unique`(`A`, `B`),
    INDEX `_User_LecturesAttendance_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Course_Students` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Course_Students_AB_unique`(`A`, `B`),
    INDEX `_Course_Students_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Course_Admins` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Course_Admins_AB_unique`(`A`, `B`),
    INDEX `_Course_Admins_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Course_Lectures` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Course_Lectures_AB_unique`(`A`, `B`),
    INDEX `_Course_Lectures_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
