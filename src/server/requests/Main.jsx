import React from 'react';
import ReactDOMServer from 'react-dom/server';

import UsersList from '@/front/components/UsersList.jsx';

import { readJSONFile } from '@/back/services/fs.js';

import fs from 'fs';

let typeLayout = fs.readFileSync('./src/server/main.html', {
  encoding: 'utf8',
});

const Main = async (req, res, next) => {
  const users = await readJSONFile({
    name: 'example',
    path: './results/example'
  });

  const content = ReactDOMServer.renderToString(<UsersList users = { users.userFriends.items || [] } />);

  typeLayout = typeLayout.replace('<div id="app"></div>', `<div id="app">${content}</div>`);
  typeLayout = typeLayout.replace('<!--SSR script-->', `<script>window.users = ${JSON.stringify(users)}</script>`);

  res.contentType('text/html');
  res.status(200);

  res.send(typeLayout);

  next();
}

export default Main;