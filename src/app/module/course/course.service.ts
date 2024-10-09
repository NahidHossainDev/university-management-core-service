import { Course, CourseFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { asyncForLoop } from '../../../shared/utils';
import { courseSearchableFields } from './course.constants';
import {
  ICourseCreateData,
  IPrerequisiteCourseRequest,
} from './course.interface';

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...coursePayload } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({
      data: coursePayload,
    });
    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');

    if (preRequisiteCourses && preRequisiteCourses?.length > 0) {
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
  data: Partial<ICourseCreateData>
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = data;
  await prisma.$transaction(async transictionClient => {
    const res = await transictionClient.course.update({
      where: { id },
      data: courseData,
    });

    if (!res)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');

    if (preRequisiteCourses && preRequisiteCourses?.length > 0) {
      const deletePreRequisite = preRequisiteCourses.filter(el => el.isDeleted);
      const newPreRequisite = preRequisiteCourses.filter(el => !el.isDeleted);

      await asyncForLoop(
        deletePreRequisite,
        async (deletePreCrouse: IPrerequisiteCourseRequest) => {
          await transictionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletePreCrouse.courseId,
                },
              ],
            },
          });
        }
      );

      await asyncForLoop(
        newPreRequisite,
        async (insertPrerequisite: IPrerequisiteCourseRequest) => {
          await transictionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: insertPrerequisite.courseId,
            },
          });
        }
      );
    }
  });

  const responseData = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return responseData;
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

const assignFaculty = async (
  id: string,
  facultiesIds: string[]
): Promise<CourseFaculty[]> => {
  const data = facultiesIds.map(facultyId => ({ courseId: id, facultyId }));

  await prisma.courseFaculty.createMany({ data });

  const result = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });

  return result;
};

const removeAssignFaculty = async (
  id: string,
  facultiesIds: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: facultiesIds,
      },
    },
  });

  const result = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });

  return result;
};

export const CourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignFaculty,
  removeAssignFaculty,
};
