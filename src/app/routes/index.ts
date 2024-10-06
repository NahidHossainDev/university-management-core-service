import express from 'express';
import { academicDepartmentRoutes } from '../module/academicDepartment/academicDepartment.routes';
import { AcademicSemesterRoutes } from '../module/academicSemester/academicSemester.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-departments',
    route: academicDepartmentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
