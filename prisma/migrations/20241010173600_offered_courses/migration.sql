-- CreateTable
CREATE TABLE "OfferedCourse" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicDepartmentId" TEXT NOT NULL,
    "semesterRetistrationId" TEXT NOT NULL,

    CONSTRAINT "OfferedCourse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfferedCourse" ADD CONSTRAINT "OfferedCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferedCourse" ADD CONSTRAINT "OfferedCourse_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferedCourse" ADD CONSTRAINT "OfferedCourse_semesterRetistrationId_fkey" FOREIGN KEY ("semesterRetistrationId") REFERENCES "semester_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
