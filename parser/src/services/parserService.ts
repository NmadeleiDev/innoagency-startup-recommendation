import { MongoUser } from '../db/mongo/mongo';
import log from '../logger/logger';
import { BONalogService } from './BONalog';
import { Service } from './Service';

export const parseINN = async (inn: string | number) => {
  if (!inn) return log.error('No inn to parse');
  const result = await BONalogService.getInfoByInn(inn);
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
  const promises = inns.map((inn) => BONalogService.getInfoByInn(inn));
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
  const response = inns.map((inn, i) => ({ [inn]: DBupdates[i] }));
  mongo.closeConnection();
  return response;
};
