import { MongoUser } from '../db/mongo/mongo';
import { UpdateResult } from 'mongodb';
import log from '../logger/logger';
import { isFullfilledPromiseResult } from '../server/utils';
import { BONalogService } from './BONalog';
import { Service } from './Service';

export const parseINN = async (inn: string | number) => {
  if (!inn) return log.error('No inn to parse');
  const result = await BONalogService.getInfo(inn.toString());
  if (!result) return { [inn]: false };

  const mongo = new MongoUser();
  await mongo.initConnection();
  const resp = await mongo.updateServiceByInn(new Service(result).getService());
  mongo.closeConnection();
  return { [inn]: resp };
};

export const parseINNs = async (inns: string[] | number[]) => {
  if (!inns) return log.error('No inn to parse');
  if (inns.length === 1) return parseINN(inns[0]);
  const promises = inns.map((inn) => BONalogService.getInfo(inn));
  const results = await Promise.allSettled(promises);

  const mongo = new MongoUser();
  await mongo.initConnection();
  const DBpromises = results.map(
    (result) =>
      result.status === 'fulfilled' &&
      result.value !== null &&
      mongo.updateServiceByInn(new Service(result.value).getService())
  );
  const DBupdates = await Promise.allSettled(DBpromises);
  const response = inns.map((inn, i) => ({
    [inn]:
      (isFullfilledPromiseResult<UpdateResult>(DBupdates[i]) &&
        (DBupdates[i] as PromiseFulfilledResult<UpdateResult>).value) ||
      false,
  }));
  mongo.closeConnection();
  return response;
};

export const parseName = async (name: string | number) => {
  if (!name) return log.error('No name to parse');
  const result = await BONalogService.getInfo(name.toString());
  if (!result) return { [name]: false };

  const mongo = new MongoUser();
  await mongo.initConnection();
  const resp = await mongo.updateServiceByInn(new Service(result).getService());
  mongo.closeConnection();
  return { [name]: resp };
};
