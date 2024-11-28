const bNumb = (numb) => {
  return (numb < 10) ? '0' + numb : numb;
}

export const bDate = () => {
  const date = new Date();

  const day = bNumb(date.getDate());
  const month = bNumb(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}