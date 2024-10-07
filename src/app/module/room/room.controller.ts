import { Room } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { roomFilterableFields } from './room.constants';
import { RoomServices } from './room.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = await RoomServices.insertIntoDB(req.body);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room added successfully!',
    data,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, roomFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const data = await RoomServices.getAllFromDB(filter, options);

  sendResponse<IGenericResponse<Room[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room added successfully!',
    data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const data = await RoomServices.getByIdFromDB(req.params.id);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room added successfully!',
    data,
  });
});

const updateDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await RoomServices.updateIntoDB(req.params.id, req.body);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room added successfully!',
    data,
  });
});

const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await RoomServices.deleteFromDB(req.params.id);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room added successfully!',
    data,
  });
});

export const RoomController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateDataById,
  deleteDataById,
};
