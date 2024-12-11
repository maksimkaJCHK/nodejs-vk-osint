const bNumb = (numb) => (numb < 10) ? `0${numb}` : numb;

export const bDate = () => {
  const date = new Date();

  const day = bNumb(date.getDate());
  const month = bNumb(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

const bMapFromArr = (arr) => {
  const bMap = new Map();

  // Что-то должно быть ключом, в большинстве случаев это будет id-ик
  arr.forEach((el) => bMap.set(el.id, el));

  return bMap;
}

const compareArrObj = (fArr, sArr) => {
  const commоn = [];
  const fUniqVal = [];
  const sUniqVal= [];

  const fMap = bMapFromArr(fArr);
  const sMap = bMapFromArr(sArr);

  for (const id of fMap.keys()) {
    const isItem = sMap.has(id);

    if (isItem) {
      commоn.push(fMap.get(id));
      sMap.delete(id);
    }

    if (!isItem) fUniqVal.push(fMap.get(id));
  }

  for (const item of sMap.values()) sUniqVal.push(item);

  return {
    commоn,
    fUniqVal,
    sUniqVal
  }
}