import { OfferedCourse, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  offeredCourseRelationalFields,
  offeredCourseRelationalFieldsMapper,
  offeredCourseSearchableFields,
} from './offeredCourse.constants';
import {
  IOfferedCourseCreateData,
  IOfferedCourseFilterRequest,
} from './offeredCourse.interface';

const insertIntoDB = async (data: IOfferedCourseCreateData): Promise<any> => {
  const { academicDepartmentId, coursesId, semesterRegistrationId } = data;
  const payload = coursesId.map(courseId => ({
    academicDepartmentId,
    semesterRegistrationId,
    courseId,
  }));
  await prisma.offeredCourse.createMany({
    data: payload,
    skipDuplicates: true,
  });

  // Retrieve the inserted records with full details
  const result = await prisma.offeredCourse.findMany({
    where: {
      academicDepartmentId,
      semesterRegistrationId,
      courseId: {
        in: coursesId,
      },
    },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (offeredCourseRelationalFields.includes(key)) {
          return {
            [offeredCourseRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.OfferedCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourse.findMany({
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.offeredCourse.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<OfferedCourse | null> => {
  const res = await prisma.offeredCourse.findUnique({
    where: { id },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });
  return res;
};

const updateOneInDB = async (
  id: string,
  data: Partial<IOfferedCourseCreateData>
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.update({
    where: { id },
    data,
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true,
    },
  });

  return result;
};
const deleteByIdFromDB = async (id: string): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.delete({
    where: { id },
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true,
    },
  });

  return result;
};

export const OfferedCourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
