import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = Router();

router.get(
  '/get-my-semester-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMySemesterRegCourses
);

router.get('/', SemesterRegistrationController.getAllData);
router.get('/:id', SemesterRegistrationController.getAllData);

router.post(
  '/',
  validateRequest(SemesterRegistrationValidation.create),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.deleteOneFromDB
);

router.post(
  '/enroll-into-course',
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.enrollIntoCourse
);

router.post(
  '/withdraw-from-course',
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.withdrawFromCourse
);
router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmMyRegistration
);
export const SemesterRegisterRouter = router;

router.post(
  '/start-new-semester/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.startNewSemester
);
