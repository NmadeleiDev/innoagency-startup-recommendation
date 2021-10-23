import { DSN } from './config';
import log from '../../logger/logger';
import mongoose, { Connection } from 'mongoose';
import { ServiceModel } from './models';

export class Mongo {
  private db: Connection = null;

  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect(DSN);
    this.db = mongoose.connection;
    log.info('connected to mongo with DSN', DSN);

    this.db.on('error', log.error.bind(log, 'MongoDB connection error: '));
  }

  //   async connect() {
  //     this.client = new MongoClient(DSN);
  //     log.debug('mongo client', this.client);

  //     await this.client.connect();
  //     this.db = this.client.db(this.db_name);
  //     await this.client.db(this.db_name).command({ ping: 1 });
  //     console.log('Connected successfully to server');
  //   }

  //   async close() {
  //     await this.client.close();
  //   }

  async insertService(service) {
    const doc = new ServiceModel();
    return await doc.save(service);
  }

  async insertServices(services) {
    const doc = new ServiceModel();
    return await doc.save(services);
  }
}
