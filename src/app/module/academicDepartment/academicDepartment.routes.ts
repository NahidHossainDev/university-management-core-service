import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = Router();

router.post(
  '/create',
  validateRequest(AcademicDepartmentValidation.create),
  AcademicDepartmentController.insertIntoDB
);

router.get('/all', AcademicDepartmentController.getAllFromDB);

export const AcademicDepartmentRoutes = router;
