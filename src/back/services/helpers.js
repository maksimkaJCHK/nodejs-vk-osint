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

export const compareArrObj = (fArr, sArr) => {
  const commоn = [];
  const fUniqVal = [];
  const lUniqVal= [];

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

  for (const item of sMap.values()) lUniqVal.push(item);

  return {
    commоn,
    fUniqVal,
    lUniqVal
  }
}

export const compareArr = (arr1, arr2) => {
  const commоn = [];
  const fUniqVal = [];

  const fArr = [...arr1];
  const sArr = [...arr2];

  for (const item of fArr) {
    const idxItem = sArr.indexOf(item);
    const isItem = idxItem !== -1;

    if (isItem) {
      commоn.push(item);
      sArr.splice(idxItem, 1);
    }

    if (!isItem) fUniqVal.push(item);
  }

  return {
    commоn,
    fUniqVal,
    lUniqVal: sArr
  }
}

export const parseFriends = (firstData, lastData) => {
  const fFriendData = firstData?.userFriends?.items || [];
  const lFriendData = lastData?.userFriends?.items || [];

  const infoAboutFriends = compareArrObj(fFriendData, lFriendData);

  const {
    fUniqVal: removedFriends,
    lUniqVal: addFriends
  } = infoAboutFriends;

  return {
    countRemovedFriends: removedFriends.length,
    countAddFriends: addFriends.length,
    removedFriends,
    addFriends,
  }
}

export const parseFolowers = (firstData, lastData) => {
  const fFriendData = firstData?.folowers?.items || [];
  const lFriendData = lastData?.folowers?.items || [];

  const infoAboutFriends = compareArrObj(fFriendData, lFriendData);

  const {
    fUniqVal: removedFolowers,
    lUniqVal: addFolowers
  } = infoAboutFriends;

  return {
    countRemovedFolowers: removedFolowers.length,
    countAddFolowers: addFolowers.length,
    removedFolowers,
    addFolowers,
  }
}

export const parseGroups = (firstData, lastData) => {
  const fGroupData = firstData?.groups?.items || [];
  const lGroupData = lastData?.groups?.items || [];

  const infoAboutGroups = compareArrObj(fGroupData, lGroupData);

  const {
    fUniqVal: removedGroups,
    lUniqVal: addGroups
  } = infoAboutGroups;

  return {
    countRemovedGroups: removedGroups.length,
    countAddGroups: addGroups.length,
    removedGroups,
    addGroups
  }
}

export const parseSubscriptions = (firstData, lastData) => {
  const fGroupData = firstData?.subscriptions?.groups?.items || [];
  const lGroupData = lastData?.subscriptions?.groups?.items || [];
  const fUsersData = firstData?.subscriptions?.users?.items || [];
  const lUsersData = lastData?.subscriptions?.users?.items || [];

  const infoAboutGroups = compareArr(fGroupData, lGroupData);
  const infoAboutUsers = compareArr(fUsersData, lUsersData);

  const {
    fUniqVal: removedSubGroups,
    lUniqVal: addSubGroups
  } = infoAboutGroups;

  const {
    fUniqVal: removedSubUsers,
    lUniqVal: addSubUsers
  } = infoAboutUsers;

  return {
    countRemovedSubGroups: removedSubGroups.length,
    countAddSubGroups: addSubGroups.length,
    countRemovedSubUsers: removedSubUsers.length,
    countAddSubUsers: addSubUsers.length,
    removedSubGroups,
    addSubGroups,
    removedSubUsers,
    addSubUsers
  }
}