import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = Router();

router.post(
  '/create',
  validateRequest(AcademicSemesterValidation.create),
  AcademicSemesterController.insertIntoDB
);

router.get('/all', AcademicSemesterController.getAllData);

router.get('/:id', AcademicSemesterController.getDataById);

router.patch(
  '/:id',
  validateRequest(AcademicSemesterValidation.update),
  AcademicSemesterController.updateDataById
);

router.delete('/:id', AcademicSemesterController.deleteById);

export const AcademicSemesterRoutes = router;
