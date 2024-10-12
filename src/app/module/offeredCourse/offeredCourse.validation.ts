import { z } from 'zod';

const create = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'Academic department id is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester registration id is required',
    }),
    courseId: z
      .array(
        z.object({
          courseId: z.string({ required_error: 'Course id is required' }),
        }),
        {
          required_error: 'Courses ids required',
        }
      )
      .optional(),
  }),
});

const update = z.object({
  body: z.object({
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),

    courseId: z
      .array(
        z.object({
          courseId: z.string({}),
        })
      )
      .optional(),
  }),
});

export const OfferedCourseValidation = {
  create,
  update,
};
