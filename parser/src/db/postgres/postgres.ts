import { Pool, QueryResult } from 'pg';
import { DSN } from './config';
import log from '../../logger/logger';
const POSTGRES_SCHEME = process.env.POSTGRES_SCHEME || 'hypertube';

log.debug('creating pool');
const pool = new Pool({
  max: 20,
  connectionString: DSN,
  idleTimeoutMillis: 30000,
});
log.debug('pool created', pool);
log.debug('testing connection');
pool.query(`SELECT 1 from ${POSTGRES_SCHEME}.movies`, (error) => {
  if (error) throw error;
  console.log('Connection succeded');
});

export async function query(
  text: string,
  values: (string | number | Date)[] = []
): Promise<QueryResult<any>> {
  try {
    const start = Date.now();
    log.trace('Executing query', { text, values });
    const res = await pool.query({ text, values });
    const duration = Date.now() - start;
    log.info('Executed query', {
      text,
      values,
      duration,
      rows: res.rowCount,
    });
    log.trace('Result:', res.rows);
    return res;
  } catch (e) {
    log.error(e, text, values);
    return {
      rows: [],
      command: text.split(' ')[0],
      rowCount: 0,
      oid: 0,
      fields: [],
    };
  }
}

const createTables = async () => {
  const acceleratorsTableQuery = `
    CREATE TABLE IF NOT EXISTS accelerators {
      code        char(5) CONSTRAINT firstkey PRIMARY KEY,
      title       varchar(40) NOT NULL,
    }
  `;
};
