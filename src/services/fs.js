import fs from 'fs';
import logger from '../logger/logger.js';

export const makeFolder = (nameFolder) => {
  fs.mkdir(nameFolder, err => {
    if (err) {
      logger.error(`Не удалось создать папку ${nameFolder}`);
      logger.error(`${err}`);
    }

    if (!err) logger.success(`Папка ${nameFolder} успешно создана`);
  });
};

export const readJSONFile = ({ name, path = './results/' }) => new Promise((resolve, reject) => {
  let obj;

  fs.readFile(`${path}/${name}.json`, 'utf8', function(err, data) {
    if (err) {
      resolve(null);

      return;
    }

    obj = JSON.parse(data);

    resolve(obj);
  });
});

export const writeToJSON = ({
  path = './',
  name,
  data,
  spices = 2
}) => {
  fs.appendFileSync(`${path}/${name}.json`, JSON.stringify(data, null, spices));
};

export const createFolders = (paths) => paths.forEach((path) => makeFolder(path));
