/*
  Warnings:

  - A unique constraint covering the columns `[courseId,academicDepartmentId,semesterRegistrationId]` on the table `OfferedCourse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OfferedCourse_courseId_academicDepartmentId_semesterRegistr_key" ON "OfferedCourse"("courseId", "academicDepartmentId", "semesterRegistrationId");
