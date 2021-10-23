import { MongoClient, Collection } from 'mongodb';
import { DSN } from './config';
import log from '../../logger/logger';

export class Mongo {
  private client = null;
  private db = null;
  private collections: { service: Collection; company: Collection } = {
    service: null,
    company: null,
  };

  constructor() {
    this.connect();
  }

  connect() {
    return MongoClient.connect(DSN, (err, client) => {
      if (err) {
        log.error('Connection to MongoDB error: ', err);
        throw err;
      }

      log.info(`Connected to MongoDB on DSN ${DSN}`);

      this.client = client;
    });
  }

  initDatabase() {
    const db_name = 'parse_data';
    const service_collection = 'service';
    const company_collection = 'company';

    this.db = this.client.db(db_name);
    this.collections.service = this.db.createCollection(service_collection);
    this.collections.company = this.db.createCollection(company_collection);
  }

  insertService(service) {
    this.collections.service.insertOne(service);
  }

  insertServices(services) {
    this.collections.service.insertMany(services);
  }
}
