import express from 'express';
import { AcademicSemesterRoutes } from '../module/academicSemester.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academics-semesters',
    route: AcademicSemesterRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
