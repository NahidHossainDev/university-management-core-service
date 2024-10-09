import express from 'express';
import { AcademicDepartmentRoutes } from '../module/academicDepartment/academicDepartment.routes';
import { AcademicFacultyRoutes } from '../module/academicFaculty/academicFaculty.routes';
import { AcademicSemesterRoutes } from '../module/academicSemester/academicSemester.routes';
import { BuildingRoutes } from '../module/building/building.routes';
import { CourseRoutes } from '../module/course/course.route';
import { FacultyRoutes } from '../module/faculty/faculty.routes';
import { RoomRoutes } from '../module/room/room.routes';
import { SemesterRegisterRouter } from '../module/semesterRegistration/semesterRegistration.router';
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
  {
    path: '/building',
    route: BuildingRoutes,
  },
  {
    path: '/room',
    route: RoomRoutes,
  },
  {
    path: '/course',
    route: CourseRoutes,
  },
  {
    path: '/semester-register',
    route: SemesterRegisterRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
