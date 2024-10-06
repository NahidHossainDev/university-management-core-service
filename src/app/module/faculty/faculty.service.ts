import { Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  facultyRelationalFields,
  facultyRelationalFieldsMapper,
  facultySearchableFields,
} from './faculty.constants';

const insertIntoDB = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...otherFilters } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(otherFilters).length > 0) {
    andConditions.push({
      AND: Object.entries(otherFilters).map(([key, value]) =>
        facultyRelationalFields.includes(key)
          ? {
              /// For Relational field filter
              [facultyRelationalFieldsMapper[key]]: {
                id: value,
              },
            }
          : {
              [key]: { equals: value },
            }
      ),
    });
  }

  const whereCondition: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.faculty.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.faculty.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getByIdFromDB = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: { id },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Faculty>
): Promise<Faculty> => {
  const result = await prisma.faculty.update({ where: { id }, data });
  return result;
};

const deleteFromDB = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: { id },
  });
  return result;
};

export const FacultyService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
