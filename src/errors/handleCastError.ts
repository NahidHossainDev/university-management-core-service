import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (error: Prisma.PrismaClientKnownRequestError) => {
  let message = '';
  let errors: IGenericErrorMessage[] = [];

  if (error.code === ' P2024') {
    message = (error.meta?.cause as string) || 'Record not found';
    errors = [
      {
        path: '',
        message,
      },
    ];
  }

  const statusCode = 400;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
