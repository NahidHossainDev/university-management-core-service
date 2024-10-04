import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../interfaces/common';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
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

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicSemesterService.getAllSemesters();
  sendResponse<IGenericResponse<AcademicSemester[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester get successfully!',
    data,
  });
});

export const AcademicSemesterController = {
  insertIntoDB,
  getAllSemesters,
};
