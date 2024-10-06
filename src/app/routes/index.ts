import express from 'express';
import { AcademicDepartmentRoutes } from '../module/academicDepartment/academicDepartment.routes';
import { AcademicFacultyRoutes } from '../module/academicFaculty/academicFaculty.routes';
import { AcademicSemesterRoutes } from '../module/academicSemester/academicSemester.routes';
import { FacultyRoutes } from '../module/faculty/faculty.routes';
import { StudentRoutes } from '../module/student/student.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/faculty',
    route: FacultyRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
