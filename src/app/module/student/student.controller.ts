import { Student } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from './student.constants';
import { StudentService } from './student.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = await StudentService.insertIntoDB(req.body);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student added successfully!',
    data,
  });
});

const getAllData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const data = await StudentService.getAllFromDB(filters, options);

  sendResponse<IGenericResponse<Student[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student get successfully!',
    data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await StudentService.getByIdFromDB(req.params.id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student get successfully!',
    data,
  });
});

const updateDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await StudentService.updateIntoDB(req.params.id, req.body);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully!',
    data,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const data = await StudentService.deleteFromDB(req.params.id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully!',
    data,
  });
});

const myCourses = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const filter = pick(req.query, ['courseId', 'academicSemesterId']);
  const result = await StudentService.myCourses(user.userId, filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Courses data fetched successfully',
    data: result,
  });
});

export const StudentController = {
  insertIntoDB,
  getAllData,
  getDataById,
  updateDataById,
  deleteById,
  myCourses,
};
