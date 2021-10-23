import { Express } from 'express';
import { createSuccessResponse, createErrorResponse } from './utils';
import log from '../logger/logger';

export function addParsingHandler(app: Express) {
  app.get('/parse', async (req, res) => {
    log.trace(req);
  });
}
