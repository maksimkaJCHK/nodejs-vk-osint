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