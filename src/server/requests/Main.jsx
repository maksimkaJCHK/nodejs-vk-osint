import React from 'react';
import ReactDOMServer from 'react-dom/server';

import UsersList from '../../front/components/UsersList.jsx';

import { readJSONFile } from '../../back/services/fs.js';

const Main = async (req, res, next) => {
  const users = await readJSONFile({
    name: 'example',
    path: './results/example'
  });

  const content = ReactDOMServer.renderToString(<UsersList users={ users } />);

  res.contentType('text/html');
  res.status(200);

  res.send(content);

  next();
}

export default Main;