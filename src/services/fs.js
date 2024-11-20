import fs from 'fs';

export const makeFolder = (nameFolder) => {
  fs.mkdir(nameFolder, err => {
    if (err) {
      console.error(`Не удалось создать папку ${nameFolder}`);
      console.error(`${err}`);
    }

    if (!err) console.log(`Папка ${nameFolder} успешно создана`);
  });
};