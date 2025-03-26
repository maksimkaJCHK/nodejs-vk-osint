import fs from 'fs';
import logger from 'scrapy-logger';

export const makeFolder = (nameFolder) => {
  return new Promise((resolve) => {
    fs.mkdir(nameFolder, (err) => {
      if (err && err.code !== 'EEXIST') {
        logger.error(`Не удалось создать папку ${nameFolder}`);
        logger.error(`${err}`);
      }

      if (err && err.code === 'EEXIST') {
        logger.success(`Папка "${nameFolder}" была содана ранее.`);
      }

      if (!err) logger.success(`Папка ${nameFolder} успешно создана.`);

      resolve();
    });
  })
};

export const readJSONFile = ({ name, path = './results/' }) => new Promise((resolve, reject) => {
  let obj;

  logger.info(`Считываю значение их файла "${path}/${name}.json".`);

  fs.readFile(`${path}/${name}.json`, 'utf8', function(err, data) {
    if (err) {
      resolve(null);

      logger.error(`Не удалось прочитать значение из файла "${path}/${name}.json".`);

      return;
    }

    obj = JSON.parse(data);

    resolve(obj);
    logger.success(`Прочитал значение из файла "${path}/${name}.json".`);
  });
});

export const writeToJSON = ({
  path = './',
  name,
  data,
  spices = 2
}) => {
  const errorFun = (error) => {
    if (error) console.log(error);
  }

  fs.writeFile(`${path}/${name}.json`, JSON.stringify(data, null, spices), errorFun);

  logger.success(`Файл "${path}/${name}.json" создан.`);
};

export const createFolders = (paths) => paths.forEach((path) => makeFolder(path));
