import { OfferedCourseClassSchedule } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { hasTimeConflict } from '../../../shared/utils';

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
  const bookedSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      room: {
        id: data.roomId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  const newWantingSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (hasTimeConflict(bookedSlots, newWantingSlot))
    throw new ApiError(
      httpStatus.CONFLICT,
      'Room is already booked into this slot!'
    );
};

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
  const bookedSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      faculty: {
        id: data.facultyId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  const newWantingSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (hasTimeConflict(bookedSlots, newWantingSlot))
    throw new ApiError(
      httpStatus.CONFLICT,
      'Faculty is already booked into this slot!'
    );
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomAvailable,
  checkFacultyAvailable,
};
