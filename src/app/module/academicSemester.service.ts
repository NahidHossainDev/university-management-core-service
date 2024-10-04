import { AcademicSemester, PrismaClient } from '@prisma/client';
import { IGenericResponse } from '../../interfaces/common';

const prisma = new PrismaClient();

const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data,
  });
  return result;
};

const getAllSemesters = async (): Promise<
  IGenericResponse<AcademicSemester[]>
> => {
  const data = await prisma.academicSemester.findMany();
  const total = await prisma.academicSemester.count();
  return {
    meta: {
      page: 1,
      limit: 10,
      total,
    },
    data,
  };
};

export const AcademicSemesterService = {
  insertIntoDB,
  getAllSemesters,
};
