import express from 'express';
import { addParsingHandler } from './handlers';
import cors from 'cors';
import log from '../logger/logger';
const bodyParser = require('body-parser').json();

export default function startServer() {
  const port = process.env.PARSER_PORT || '2222';

  const app = express();

  app.use(bodyParser);
  app.use(cors());

  addParsingHandler(app);

  const http = require('http').createServer(app);

  http.listen(parseInt(port), () => {
    log.info(`listening on *:${port}`);
  });
}
