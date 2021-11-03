const MONGO_USER = process.env.MONGO_USER || 'mongoadmin';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '12345';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
export const DB_NAME = process.env.MONGO_DB || 'guide_data';
export const COMPANY_COLLECTION = 'company';
export const SERVICE_COLLECTION = 'service';
export const DEAL_COLLECTION = 'deal';

export const DSN = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}?authSource=admin`;
