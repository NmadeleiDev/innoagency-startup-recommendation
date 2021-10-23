import { MongoClient } from 'mongodb';
import log from '../../logger/logger';
import { IService, IServiceResult } from '../../Models/NalogModel';
import { DSN, DB_NAME } from './config';

export class MongoUser {
  private _client = null;
  private _connection = null;

  constructor(doInit = false) {
    if (doInit) this.initConnection().catch(console.warn);
  }

  async initConnection() {
    try {
      this._connection = await MongoClient.connect(DSN);
      log.info('Mongo connection succeded!');
    } catch (e) {
      log.error('Failed to connect to mongo: ', e);
      throw 'Connection error!';
    }
  }

  get connection(): MongoClient {
    return this._client;
  }

  get isConnected(): boolean {
    return this._client && this._client.isConnected();
  }

  async updateServiceByInn(service: IService): Promise<Boolean> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection('service')
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
      return res.modifiedCount > 0 ? true : false;
    } catch (e) {
      log.error('Update service error: ', e);
      throw e;
    }
  }

  async insertServiceByInn(service: IService): Promise<Boolean> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection('service')
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
      return true;
    } catch (e) {
      log.error('Update service error: ', e);
      throw e;
    }
  }

  async findServiceByInn(inn: string): Promise<IServiceResult | null> {
    try {
      const res = await this._connection
        .db(DB_NAME)
        .collection('')
        .findOne({ name: name });
      return res as IServiceResult;
    } catch (e) {
      console.warn('Error find task by name: ', e);
      return null;
    }
  }

  async closeConnection() {
    if (!this.isConnected) return;

    try {
      await this._client.close();
    } catch (e) {
      console.log('Error closing mongo con: ', e);
    }
  }
}
