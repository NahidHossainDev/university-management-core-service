import { Course, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { courseSearchableFields } from './course.constants';
import { ICourseCreateData } from './course.interface';

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...coursePayload } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({
      data: coursePayload,
    });
    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');

    if (preRequisiteCourses?.length > 0) {
      for (let i = 0; i < preRequisiteCourses.length; i++) {
        const createPreRequisite =
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: result.id,
              preRequisiteId: preRequisiteCourses[i].courseId,
            },
          });
        console.log(createPreRequisite);
      }
    }
    return result;
  });

  if (newCourse) {
    const res = await prisma.course.findUnique({
      where: { id: newCourse.id },
      include: {
        preRequisite: {
          include: { preRequisite: true },
        },
        preRequisiteFor: {
          include: { course: true },
        },
      },
    });
    return res;
  }
};

const getAllFromDB = async (
  filter: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const { searchTerm, ...otherFilter } = filter;

  const andConditions: Prisma.CourseWhereInput['AND'] = [];

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableFields.map(filter => ({
        [filter]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(otherFilter).length > 0) {
    andConditions.push({
      AND: Object.entries(otherFilter).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const whereCondition: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.course.findMany({
    where: whereCondition,
    include: {
      preRequisite: {
        include: { preRequisite: true },
      },
      preRequisiteFor: {
        include: { course: true },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.course.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getByIdFromDB = async (id: string): Promise<Course | null> => {
  const res = await prisma.course.findUnique({
    where: { id },
    include: {
      preRequisite: {
        include: { preRequisite: true },
      },
      preRequisiteFor: {
        include: { course: true },
      },
    },
  });
  return res;
};

const updateOneInDB = async (
  id: string,
  data: Partial<Course>
): Promise<Course | null> => {
  const res = await prisma.course.update({
    where: { id },
    data,
    include: {
      preRequisite: {
        include: { preRequisite: true },
      },
      preRequisiteFor: {
        include: { course: true },
      },
    },
  });
  return res;
};

const deleteByIdFromDB = async (id: string): Promise<Course | null> => {
  await prisma.courseToPrerequisite.deleteMany({
    where: {
      OR: [{ courseId: id }, { preRequisiteId: id }],
    },
  });
  const res = await prisma.course.delete({
    where: { id },
  });
  return res;
};

export const CourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
