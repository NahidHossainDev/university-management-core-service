import { AcademicFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicFacultyFilterableFields } from './academicFaculty.constants';
import { AcademicFacultyService } from './academicFaculty.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicFacultyService.insertIntoDB(req.body);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty added successfully!',
    data,
  });
});

const getAllData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, academicFacultyFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const data = await AcademicFacultyService.getAllFromDB(filters, options);

  sendResponse<IGenericResponse<AcademicFaculty[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty get successfully!',
    data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicFacultyService.getByIdFromDB(req.params.id);

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty get successfully!',
    data,
  });
});

const updateDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicFacultyService.updateIntoDB(
    req.params.id,
    req.body
  );

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty updated successfully!',
    data,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicFacultyService.deleteFromDB(req.params.id);

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty deleted successfully!',
    data,
  });
});

export const AcademicFacultyController = {
  insertIntoDB,
  getAllData,
  getDataById,
  updateDataById,
  deleteById,
};
