import { Express } from 'express';
import { createSuccessResponse, createErrorResponse } from './utils';
import log from '../logger/logger';
import { parseINN, parseINNs } from '../services/parserService';

export function addParsingHandler(app: Express) {
  app.get('/parse', async (req, res) => {
    log.trace(req);
    log.debug('GET [/parse] query', req.query);
    if (!req.query.q) {
      return res.status(400).send(createErrorResponse(`Query is empty`));
    }
    try {
      // if we got list of inns
      if (req.query.q.toString().search(/,/) >= 0) {
        const queries = req.query.q.toString().split(/\s+,\s+/);
        log.debug('Queries', queries);
        const resp = await parseINNs(queries);
        return res.status(200).send(createSuccessResponse(resp));
      }

      const data = await parseINN(req.query?.q.toString());
      return data
        ? res.status(200).send(createSuccessResponse(data))
        : res
            .status(404)
            .send(createErrorResponse(`Service with ${req.query.q} not found`));
    } catch (e) {
      log.error(e);
      res.status(500).send(createErrorResponse(`Server error`));
    }
  });

  app.post('/parse', async (req, res) => {
    log.debug(req);
    log.debug('POST [/parse] body', req.body);
    if (!req.body.q) {
      return res.status(400).send(createErrorResponse(`body is empty`));
    }
    try {
      // if we got list of inns
      if (req.body.q[0].length > 1) {
        const queries = req.body.q;
        log.debug('Queries', queries);
        const resp = await parseINNs(queries);
        return res.status(200).send(createSuccessResponse(resp));
      }

      const data = await parseINN(req.body?.q);
      return data
        ? res.status(200).send(createSuccessResponse(data))
        : res
            .status(404)
            .send(createErrorResponse(`Service with ${req.body.q} not found`));
    } catch (e) {
      log.error(e);
      res.status(500).send(createErrorResponse(`Server error`));
    }
  });
}
