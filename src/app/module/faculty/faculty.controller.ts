import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constants';
import { FacultyService } from './faculty.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = await FacultyService.insertIntoDB(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty added successfully!',
    data,
  });
});

const getAllData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const data = await FacultyService.getAllFromDB(filters, options);

  sendResponse<IGenericResponse<Faculty[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty get successfully!',
    data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await FacultyService.getByIdFromDB(req.params.id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty get successfully!',
    data,
  });
});

const updateDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await FacultyService.updateIntoDB(req.params.id, req.body);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully!',
    data,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const data = await FacultyService.deleteFromDB(req.params.id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully!',
    data,
  });
});

export const FacultyController = {
  insertIntoDB,
  getAllData,
  getDataById,
  updateDataById,
  deleteById,
};
