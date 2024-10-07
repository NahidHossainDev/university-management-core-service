import { Building } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { buildingFilterableFields } from './building.constants';
import { BuildingServices } from './building.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = await BuildingServices.insertIntoDB(req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building added successfully!',
    data,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, buildingFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const data = await BuildingServices.getAllFromDB(filter, options);

  sendResponse<IGenericResponse<Building[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building added successfully!',
    data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const data = await BuildingServices.getByIdFromDB(req.params.id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building added successfully!',
    data,
  });
});

const updateDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await BuildingServices.updateIntoDB(req.params.id, req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building added successfully!',
    data,
  });
});

const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const data = await BuildingServices.deleteFromDB(req.params.id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building added successfully!',
    data,
  });
});

export const BuildingController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateDataById,
  deleteDataById,
};
