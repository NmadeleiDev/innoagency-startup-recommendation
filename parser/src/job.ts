import { MongoUser } from './db/mongo/mongo';
import { parseINNs, updateServicesInDB } from './services/parserService';

const updateDatabase = async () => {
  const mongo = new MongoUser();
  await mongo.initConnection();
  const startups = await mongo.listAllServices();
  const services = await parseINNs(startups);
  updateServicesInDB(services);
};

updateDatabase();
