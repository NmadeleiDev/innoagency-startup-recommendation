import { MongoUser } from '../db/mongo/mongo';
import log from '../logger/logger';
import { isFullfilledPromiseResult } from '../server/utils';
import { BONalogService } from './BONalog';
import { Service } from './Service';
import { IService, IServiceResult } from '../Models/NalogModel';
const DELAY_BETWEEN_SERVICES = 1000;
let delay = 0;

export const parseINN = async (inn: string | number) => {
  if (!inn) return log.error('No inn to parse');
  const result = await BONalogService.getInfo(inn.toString());
  return new Service(result).getService();
};

export const parseINNs = async (inns: string[] | number[]) => {
  if (!inns) return log.error('No inn to parse');
  if (inns.length === 1) return [await parseINN(inns[0])];
  const promises = inns.map((inn) =>
    new Promise((resolve) =>
      setTimeout(resolve, (delay += DELAY_BETWEEN_SERVICES))
    ).then(() => BONalogService.getInfo(inn))
  );
  const services = (await Promise.allSettled(promises))
    .filter(
      (result) => isFullfilledPromiseResult(result) && result.value !== null
    )
    .map((result: PromiseFulfilledResult<IServiceResult>) =>
      new Service(result.value).getService()
    );
  return services;
};

export const updateServiceInDB = async (service: IService) => {
  const mongo = new MongoUser();
  await mongo.initConnection();
  const resp = await mongo.updateServiceByInn(service);
  return resp;
};

export const updateServicesInDB = async (services: IService[]) => {
  const mongo = new MongoUser();
  await mongo.initConnection();
  const response = await mongo.updateServicesByInn(services);
  return response;
};
