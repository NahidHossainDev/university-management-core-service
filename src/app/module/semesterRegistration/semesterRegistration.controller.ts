import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constants';
import { SemesterRegistrationService } from './semesterRegistration.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = await SemesterRegistrationService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data,
    message: 'Semester Registration created successfully!',
  });
});

const getAllData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.params, semesterRegistrationFilterableFields);
  const otherFilters = pick(req.params, [
    'limit',
    'page',
    'sortBy',
    'sortOrder',
  ]);
  const data = await SemesterRegistrationService.getAllData(
    filters,
    otherFilters
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data,
    message: 'Semester Registration get successfully!',
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await SemesterRegistrationService.getDataById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data,
    message: 'Semester Registration get successfully!',
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const data = await SemesterRegistrationService.updateOneInDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data,
    message: 'Semester Registration updated successfully!',
  });
});

const deleteOneFromDB = catchAsync(async (req: Request, res: Response) => {
  const data = await SemesterRegistrationService.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data,
    message: 'Semester Registration deleted successfully!',
  });
});

export const SemesterRegistrationController = {
  insertIntoDB,
  getAllData,
  getDataById,
  updateOneInDB,
  deleteOneFromDB,
};
