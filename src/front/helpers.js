export const bFullName = (name, lastName) => `${name} ${lastName}`;

export const bOccupation = (type) => {
  if (type === 'university') return 'Образование: ';
  if (type === 'work') return 'Работа: ';

  return 'Деятельность';
};