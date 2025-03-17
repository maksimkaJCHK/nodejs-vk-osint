import logger from 'scrapy-logger';

const bNumb = (numb) => (numb < 10) ? `0${numb}` : numb;

export const bDate = () => {
  const date = new Date();

  const day = bNumb(date.getDate());
  const month = bNumb(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export class UsersCompare {
  fObj;
  lObj;
  key;

  constructor(fObj, lObj, key = 'id') {
    this.fObj = fObj;
    this.lObj = lObj;

    this.key = key;
  }

  setKey(key = 'id') {
    this.key = key;
  }

  bMapFromArr(arr) {
    const bMap = new Map();
    arr.forEach((el) => bMap.set(el[this.key], el));

    return bMap;
  }

  compareArrObj(fArr, sArr) {
    const commоn = [];
    const fUniqVal = [];
    const lUniqVal= [];

    const fMap = this.bMapFromArr(fArr);
    const sMap = this.bMapFromArr(sArr);

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

  compareArr(arr1, arr2) {
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

  get friendsInfo() {
    const fFriendData = this.fObj?.userFriends?.items || [];
    const lFriendData = this.lObj?.userFriends?.items || [];

    const infoAboutFriends = this.compareArrObj(fFriendData, lFriendData);

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

  get folowersInfo() {
    const fFolowers = this.fObj?.folowers?.items || [];
    const lFolowers = this.lObj?.folowers?.items || [];

    const infoAboutFriends = this.compareArrObj(fFolowers, lFolowers);

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

  get groupsInfo() {
    const fGroup = this.fObj?.groups?.items || [];
    const lGroup = this.lObj?.groups?.items || [];
  
    const infoAboutGroups = this.compareArrObj(fGroup, lGroup);

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

  get subscriptionsInfo() {
    const fGroup = this.fObj?.subscriptions?.groups?.items || [];
    const lGroup = this.lObj?.subscriptions?.groups?.items || [];
    const fUsers = this.fObj?.subscriptions?.users?.items || [];
    const lUsers = this.lObj?.subscriptions?.users?.items || [];

    const infoAboutGroups = this.compareArr(fGroup, lGroup);
    const infoAboutUsers = this.compareArr(fUsers, lUsers);

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

  get info() {
    const {
      countRemovedFriends,
      countAddFriends,
      removedFriends,
      addFriends
    } = this.friendsInfo;

    const {
      countRemovedFolowers,
      countAddFolowers,
      removedFolowers,
      addFolowers
    } = this.folowersInfo;

    const {
      countRemovedGroups,
      countAddGroups,
      removedGroups,
      addGroups
    } = this.groupsInfo;

    const {
      countRemovedSubGroups,
      countAddSubGroups,
      countRemovedSubUsers,
      countAddSubUsers,
      removedSubGroups,
      addSubGroups,
      removedSubUsers,
      addSubUsers
    } = this.subscriptionsInfo;

    return {
      countRemovedFolowers,
      countAddFolowers,
      countRemovedFriends,
      countAddFriends,
      countRemovedGroups,
      countAddGroups,
      countRemovedSubGroups,
      countAddSubGroups,
      countRemovedSubUsers,
      countAddSubUsers,
      removedFriends,
      addFriends,
      removedFolowers,
      addFolowers,
      removedGroups,
      addGroups,
      removedSubGroups,
      addSubGroups,
      removedSubUsers,
      addSubUsers
    }
  }
}