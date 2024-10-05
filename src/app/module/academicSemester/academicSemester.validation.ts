import { z } from 'zod';
import { months, semesterCodeType } from './academicSemester.constants';

const create = z.object({
  body: z.object({
    year: z.number({
      required_error: 'Year is required',
    }),
    title: z.string({
      required_error: 'Title is required',
    }),
    code: z.enum(semesterCodeType as [string, ...string[]], {
      required_error: 'Code is required',
    }),
    startMonth: z.enum(months as [string, ...string[]], {
      required_error: 'Start month is required!',
    }),
    endMonth: z.enum(months as [string, ...string[]], {
      required_error: 'End month is required!',
    }),
  }),
});

const update = z.object({
  body: z.object({
    year: z.number().optional(),
    title: z.string(),
    code: z.enum(semesterCodeType as [string, ...string[]]).optional(),
    startMonth: z.enum(months as [string, ...string[]]).optional(),
    endMonth: z.enum(months as [string, ...string[]]).optional(),
  }),
});

export const AcademicSemesterValidation = {
  create,
  update,
};
