import { AcademicSemester, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { semesterSearchableFields } from './academicSemester.constants';

const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...otherFilters } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: semesterSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(otherFilters).length > 0) {
    andConditions.push({
      AND: Object.entries(otherFilters).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    });
  }

  const whereCondition: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.academicSemester.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.academicSemester.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getByIdFromDB = async (id: string): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: { id },
  });
  return result;
};

export const AcademicSemesterService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
};
