-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "optionalId" VARCHAR(255),
    "role" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "dateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "selectedCourseId" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(255),
    "scope" VARCHAR(255),
    "id_token" TEXT,
    "session_state" VARCHAR(255),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "courseId" VARCHAR(255) NOT NULL,
    "lectureDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceEntry" (
    "id" TEXT NOT NULL,
    "lectureId" VARCHAR(255) NOT NULL,
    "courseMemberId" VARCHAR(255) NOT NULL,
    "dateMarked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(255) NOT NULL,
    "ProfessorLectureGeolocationId" TEXT,
    "studentLatitude" DOUBLE PRECISION,
    "studentLongtitude" DOUBLE PRECISION,
    "lmsSynced" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AttendanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseCode" VARCHAR(255) NOT NULL,
    "organizationCode" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lmsType" VARCHAR(255) NOT NULL,
    "lmsId" VARCHAR(255),
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lmsAttendanceAssignmentId" VARCHAR(255),
    "StartDate" TIMESTAMP(3),
    "EndDate" TIMESTAMP(3),

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseMember" (
    "id" TEXT NOT NULL,
    "optionalId" VARCHAR(255),
    "lmsId" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "courseId" VARCHAR(255) NOT NULL,
    "dateEnrolled" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(255) NOT NULL,

    CONSTRAINT "CourseMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qrcode" (
    "id" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ProfessorLectureGeolocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qrcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ProfessorLectureGeolocationId" TEXT,
    "attendanceStudentLatitude" DOUBLE PRECISION,
    "attendanceStudentLongtitude" DOUBLE PRECISION,

    CONSTRAINT "AttendanceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthProviderCredentials" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "key" VARCHAR(50) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" VARCHAR(512) NOT NULL,
    "clientSecret" VARCHAR(512) NOT NULL,
    "allowDangerousEmailAccountLinking" BOOLEAN NOT NULL,
    "issuer" VARCHAR(512),
    "tenantId" VARCHAR(512),
    "authorizationUrl" VARCHAR(512),

    CONSTRAINT "AuthProviderCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorLectureGeolocation" (
    "id" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "courseMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lectureLatitude" DOUBLE PRECISION NOT NULL,
    "lectureLongitude" DOUBLE PRECISION NOT NULL,
    "lectureRange" INTEGER NOT NULL,

    CONSTRAINT "ProfessorLectureGeolocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "firstTimeSetupComplete" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(255) NOT NULL,
    "uniqueCode" VARCHAR(255) NOT NULL,
    "lightTheme" VARCHAR(255) NOT NULL DEFAULT 'light_neutral',
    "darkTheme" VARCHAR(255) NOT NULL DEFAULT 'dark_red',
    "googleMapsApiKey" VARCHAR(255),
    "allowUsersToUseGoogleMaps" BOOLEAN NOT NULL DEFAULT false,
    "hashEmails" BOOLEAN NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_courseId_lectureDate_key" ON "Lecture"("courseId", "lectureDate");

-- CreateIndex
CREATE UNIQUE INDEX "Course_organizationCode_courseCode_key" ON "Course"("organizationCode", "courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "Course_lmsType_lmsId_key" ON "Course"("lmsType", "lmsId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseMember_email_lmsId_key" ON "CourseMember"("email", "lmsId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseMember_email_courseId_key" ON "CourseMember"("email", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "qrcode_code_key" ON "qrcode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProviderCredentials_key_key" ON "AuthProviderCredentials"("key");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProviderCredentials_displayName_key" ON "AuthProviderCredentials"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_uniqueCode_key" ON "Organization"("uniqueCode");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_courseMemberId_fkey" FOREIGN KEY ("courseMemberId") REFERENCES "CourseMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_ProfessorLectureGeolocationId_fkey" FOREIGN KEY ("ProfessorLectureGeolocationId") REFERENCES "ProfessorLectureGeolocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_organizationCode_fkey" FOREIGN KEY ("organizationCode") REFERENCES "Organization"("uniqueCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMember" ADD CONSTRAINT "CourseMember_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMember" ADD CONSTRAINT "CourseMember_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qrcode" ADD CONSTRAINT "qrcode_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qrcode" ADD CONSTRAINT "qrcode_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qrcode" ADD CONSTRAINT "qrcode_ProfessorLectureGeolocationId_fkey" FOREIGN KEY ("ProfessorLectureGeolocationId") REFERENCES "ProfessorLectureGeolocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceToken" ADD CONSTRAINT "AttendanceToken_ProfessorLectureGeolocationId_fkey" FOREIGN KEY ("ProfessorLectureGeolocationId") REFERENCES "ProfessorLectureGeolocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorLectureGeolocation" ADD CONSTRAINT "ProfessorLectureGeolocation_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorLectureGeolocation" ADD CONSTRAINT "ProfessorLectureGeolocation_courseMemberId_fkey" FOREIGN KEY ("courseMemberId") REFERENCES "CourseMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
