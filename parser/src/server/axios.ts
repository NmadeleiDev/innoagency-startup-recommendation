import axios from 'axios';
import log from '../logger/logger';
import { delay } from './utils';
const INITIAL_DELAY = 0,
  TIMEOUT_STEP = 200,
  RETRIES = 10;

interface Response<T> {
  data: T;
  status: number;
}

export const request = async <T>(
  url: string,
  retries = RETRIES,
  timeout = INITIAL_DELAY
): Promise<Response<T> | null> => {
  if (retries <= 0) return log.error(`No retries left. URL: ${url}`);
  try {
    const response = await axios.get<T>(url, {
      validateStatus: (status) => status < 500,
    });
    log.trace(response);
    return response.status < 400 ? response : null;
  } catch (e) {
    if (e.code === 'ECONNRESET') {
      // site dropped connection, wait a little and try again
      log.info(`Retires left: ${retries}, timeout: ${timeout}`);
      await delay(timeout);
      return await request(url, retries - 1, timeout + TIMEOUT_STEP);
    }
    // Something really bad happened
    log.error(e);
    return null;
  }
};
