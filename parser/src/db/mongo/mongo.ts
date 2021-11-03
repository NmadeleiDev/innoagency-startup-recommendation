import { MongoClient, UpdateResult, InsertOneResult } from 'mongodb';
import log from '../../logger/logger';
import { IService, IServiceResult } from '../../Models/NalogModel';
import { DSN, DB_NAME, COMPANY_COLLECTION, SERVICE_COLLECTION } from './config';

export class MongoUser {
  private _connection = null;

  constructor(doInit = false) {
    if (doInit) this.initConnection().catch(console.warn);
  }

  async initConnection() {
    try {
      if (!this._connection) {
        this._connection = await MongoClient.connect(DSN);
        log.info('Mongo connection succeded!');
      } else {
        log.info('Mongo already connected');
      }
    } catch (e) {
      log.error('Failed to connect to mongo: ', e);
      throw 'Connection error!';
    }
  }

  get connection(): MongoClient {
    return this._connection;
  }

  async updateServiceByInn(service: IService): Promise<boolean> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection(SERVICE_COLLECTION)
        .updateOne(
          { inn: service.inn },
          {
            $set: {
              shortName: service.shortName,
              ogrn: service.ogrn,
              address: service.address,
              active: service.active,
              primary: service.primary,
              okved: service.okved,
              okved2: service.okved2,
              okopf: service.okopf,
              okfs: service.okfs,
              kpp: service.kpp,
              registrationDate: service.registrationDate,
              location: service.location,
              authorizedCapital: service.authorizedCapital,
              balance: service.balance,
              financialResult: service.financialResult,
              capitalChange: service.capitalChange,
              fundsMovement: service.fundsMovement,
            },
            $setOnInsert: {
              inn: service.inn,
              name: service.name,
            },
          },
          { upsert: true }
        );
      log.debug('DB updated: ', res);
      return true;
    } catch (e) {
      log.error('Update service error: ', e);
      return false;
    }
  }

  async updateServicesByInn(services: IService[]): Promise<boolean> {
    try {
      const bulk = this._connection
        .db(DB_NAME)
        .collection(SERVICE_COLLECTION)
        .initializeUnorderedBulkOp();
      console.log('bulk', bulk);
      services.forEach((service) => {
        bulk.find({ inn: service.inn }).update(
          {
            $set: {
              shortName: service.shortName,
              ogrn: service.ogrn,
              address: service.address,
              active: service.active,
              primary: service.primary,
              okved: service.okved,
              okved2: service.okved2,
              okopf: service.okopf,
              okfs: service.okfs,
              kpp: service.kpp,
              registrationDate: service.registrationDate,
              location: service.location,
              authorizedCapital: service.authorizedCapital,
              balance: service.balance,
              financialResult: service.financialResult,
              capitalChange: service.capitalChange,
              fundsMovement: service.fundsMovement,
            },
            $setOnInsert: {
              inn: service.inn,
              name: service.name,
            },
          },
          { upsert: true }
        );
      });
      const res = await bulk.execute();
      log.debug('DB updated: ', res);
      return true;
    } catch (e) {
      log.error('Update service error: ', e);
      return false;
    }
  }

  async insertServiceByInn(service: IService): Promise<InsertOneResult> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection(SERVICE_COLLECTION)
        .insertOne(
          {
            inn: service.inn,
            name: service.name,
            shortName: service.shortName,
            ogrn: service.ogrn,
            address: service.address,
            active: service.active,
            primary: service.primary,
            okved: service.okved,
            okved2: service.okved2,
            okopf: service.okopf,
            okfs: service.okfs,
            kpp: service.kpp,
            registrationDate: service.registrationDate,
            location: service.location,
            authorizedCapital: service.authorizedCapital,
            balance: service.balance,
            financialResult: service.financialResult,
            capitalChange: service.capitalChange,
            fundsMovement: service.fundsMovement,
          },
          { upsert: true }
        );
      log.debug('Value inserted: ', res);
      return res;
    } catch (e) {
      log.error('Update service error: ', e);
      throw e;
    }
  }

  async findServiceByInn(inn: string): Promise<IServiceResult | null> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection(SERVICE_COLLECTION)
        .findOne({ inn });
      return res as IServiceResult;
    } catch (e) {
      console.warn('Error find task by name: ', e);
      return null;
    }
  }

  async listAllStartups(): Promise<string[] | null> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection(COMPANY_COLLECTION)
        //find items we haven't updated yet
        .find({ inn: { $ne: '0' }, location: { $exists: false } })
        .map((item) => item.inn)
        // .limit(20)
        .toArray();
      log.debug(res);
      return res as string[];
    } catch (e) {
      log.error(e);
      return null;
    }
  }

  async listAllServices(): Promise<string[] | null> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection(SERVICE_COLLECTION)
        //find items we haven't updated yet
        .find({ inn: { $ne: '0' }, location: { $exists: false } })
        .map((item) => item.inn)
        // .limit(20)
        .toArray();
      log.debug(res);
      return res as string[];
    } catch (e) {
      log.error(e);
      return null;
    }
  }

  async closeConnection() {
    // if (!this._connection) return;

    try {
      await this._connection.close();
    } catch (e) {
      console.log('Error closing mongo con: ', e);
    }
  }
}
