import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const create = z.object({
  body: z.object({
    startDate: z.date({ required_error: 'Start date is required' }),
    endDate: z.date({ required_error: 'End date is required' }),

    minCredit: z.number({ required_error: 'Minimum credit is required' }),
    maxCredit: z.number({ required_error: 'Maximum credit is required' }),
    academicSemesterId: z.string({
      required_error: 'Academic semester is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    status: z
      .enum(
        Object.values(SemesterRegistrationStatus) as [string, ...string[]],
        {}
      )
      .optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string().optional(),
  }),
});

export const SemesterRegistrationValidation = {
  create,
  update,
};
