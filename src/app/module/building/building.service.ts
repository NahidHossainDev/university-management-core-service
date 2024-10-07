import { Building, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { buildingSearchableFields } from './building.constants';

const insertIntoDB = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: buildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereCondition: Prisma.BuildingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const data = await prisma.building.findMany({
    where: whereCondition,
    skip,
    take: limit,
  });

  const total = await prisma.building.count();
  return {
    meta: {
      limit,
      page,
      total,
    },
    data,
  };
};

const getByIdFromDB = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({ where: { id } });
  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Building>
): Promise<Building> => {
  const result = await prisma.building.update({ where: { id }, data });
  return result;
};

const deleteFromDB = async (id: string): Promise<Building> => {
  const result = await prisma.building.delete({
    where: { id },
  });
  return result;
};

export const BuildingServices = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
