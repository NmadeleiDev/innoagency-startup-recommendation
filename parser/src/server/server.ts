import express from 'express';
import { addParsingHandler } from './handlers';
import cors from 'cors';
import log from '../logger/logger';
import { BONalogService } from './services';
import { Mongo } from '../db/mongo/mongo';
const bodyParser = require('body-parser').json();

const parseData = async () => {
  const mongo = new Mongo();
  const results = BONalogService.getInfoByInn(7707770166);
  const res = await mongo.insertService(results);
  console.log(res);
};

export default function startServer() {
  const port = process.env.PARSER_PORT || '2222';

  const app = express();

  app.use(bodyParser);
  app.use(cors());

  parseData();

  addParsingHandler(app);

  const http = require('http').createServer(app);

  http.listen(parseInt(port), () => {
    log.info(`listening on *:${port}`);
  });
}
