export type IOfferedCourseCreateData = {
  coursesId: string[];
  academicDepartmentId: string;
  semesterRegistrationId: string;
};

export type IOfferedCourseFilterRequest = {
  searchTerm?: string | undefined;
  semesterRegistrationId?: string | undefined;
  courseId?: string | undefined;
  academicDepartmentId?: string | undefined;
};
