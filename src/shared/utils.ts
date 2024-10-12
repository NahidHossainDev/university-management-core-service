import { WeekDays } from '@prisma/client';

export const asyncForLoop = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) throw new Error('Expected an array!');
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

type TimeSlot = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
};

export const hasTimeConflict = (
  existingSlots: TimeSlot[],
  newSlot: TimeSlot
) => {
  for (const slot of existingSlots) {
    const exStartTime = new Date(`1970-01-01T${slot.startTime}:00`);
    const exEndTime = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStartTime = new Date(`1970-01-01T${newSlot.startTime}:00`);
    const newEndTime = new Date(`1970-01-01T${newSlot.endTime}:00`);

    if (newStartTime < exEndTime && newEndTime > exStartTime) {
      return true;
    }
  }
  return false;
};
