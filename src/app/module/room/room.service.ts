import { Prisma, Room } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  roomRelationalFields,
  roomRelationalFieldsMapper,
  roomSearchableFields,
} from './room.constants';

const insertIntoDB = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...otherFilters } = filters;
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: roomSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(otherFilters).length > 0) {
    andCondition.push({
      AND: Object.entries(otherFilters).map(([key, value]) =>
        roomRelationalFields.includes(key)
          ? {
              [roomRelationalFieldsMapper[key]]: {
                id: value,
              },
            }
          : {
              [key]: {
                equals: value,
              },
            }
      ),
    });
  }
  const whereCondition: Prisma.RoomWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const data = await prisma.room.findMany({
    where: whereCondition,
    skip,
    take: limit,
  });

  const total = await prisma.room.count();
  return {
    meta: {
      limit,
      page,
      total,
    },
    data,
  };
};

const getByIdFromDB = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: { id },
    include: {
      building: true,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, data: Partial<Room>): Promise<Room> => {
  const result = await prisma.room.update({
    where: { id },
    data,
    include: {
      building: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Room> => {
  const result = await prisma.room.delete({
    where: { id },
    include: {
      building: true,
    },
  });
  return result;
};

export const RoomServices = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
