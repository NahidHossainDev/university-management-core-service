import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterFilterableFields } from './academicSemester.constants';
import { AcademicSemesterService } from './academicSemester.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicSemesterService.insertIntoDB(req.body);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester added successfully!',
    data,
  });
});

const getAllData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, semesterFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const data = await AcademicSemesterService.getAllFromDB(filters, options);

  sendResponse<IGenericResponse<AcademicSemester[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester get successfully!',
    data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicSemesterService.getByIdFromDB(req.params.id);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester get successfully!',
    data,
  });
});

export const AcademicSemesterController = {
  insertIntoDB,
  getAllData,
  getDataById,
};
