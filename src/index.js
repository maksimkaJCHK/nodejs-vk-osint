import express from 'express';

import main from './ssr-compiled/requests/main.js';

const app = express();
const port = 8000;

app.use(express.static('./src/server/public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.get('/', main, (req, res, next) => {
  console.log('Загрузилась главная страница');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.disable('etag');