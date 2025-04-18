export const semesterType: string[] = ['AUTUMN', 'SUMMER', 'FALL'];

export const semesterCodeType: string[] = ['01', '02', '03'];

export const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const semesterTypeCodeMapper = {
  SUMMER: '01',
  AUTUMN: '02',
  FALL: '03',
};

export const semesterSearchableFields = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const semesterFilterableFields = [
  'searchTerm',
  'code',
  'startMonth',
  'endMonth',
];

export const EVENT_ACADEMIC_SEMESTER_CREATED = 'academic-semester.created';
export const EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic-semester.updated';
export const EVENT_ACADEMIC_SEMESTER_DELETED = 'academic-semester.deleted';
