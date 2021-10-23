import { Express } from 'express';
import { createSuccessResponse, createErrorResponse, delay } from './utils';
import log from '../logger/logger';
import { parseINN } from '../services/parserService';

export function addParsingHandler(app: Express) {
  app.get('/parse', async (req, res) => {
    log.trace(req);
    log.debug(req.query);
    if (!req.query.inn) {
      return res.status(400).send(createErrorResponse(`INN is empty`));
    }
    try {
      // if we got list of inns
      if (req.query.inn.toString().search(/,/) >= 0) {
        const inns = req.query.inn.toString().split(',');
        log.debug('INNs query', inns);
        const data = [];
        for (let inn of inns) {
          const resp = await parseINN(inn);
          data.push(resp);
          delay(100);
        }
        return res.status(200).send(createSuccessResponse(data));
      }

      const data = await parseINN(req.query?.inn.toString());
      return data
        ? res.status(200).send(createSuccessResponse(data))
        : res
            .status(404)
            .send(createErrorResponse(`Service with ${req.query} not found`));
    } catch (e) {
      log.error(e);
      res.status(500).send(createErrorResponse(`Server error`));
    }
  });
}
