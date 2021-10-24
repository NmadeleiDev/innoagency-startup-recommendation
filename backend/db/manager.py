import os
import logging
from typing import List, Tuple, Union
from bson.objectid import ObjectId
import pymongo
import os
from json import loads
from os import path

class DbManager():
    def __init__(self) -> None:
        self.host = os.getenv('MONGO_HOST')
        self.port = os.getenv('MONGO_PORT')
        self.user = os.getenv('MONGO_USER')
        self.password = os.getenv('MONGO_PASSWORD')

        self.db_name = 'guide_data'
        self.service_collection = 'service'
        self.company_collection = 'company'
        self.deals_collection = 'deal'
        self.enums_collection = 'enums'

    def init_connection(self):
        logging.debug("Connecting to mongo on ({}:{}, {}:{})".format(self.host, self.port, self.user, self.password))
        self.conn = pymongo.MongoClient("mongodb://{}:{}@{}:{}/{}?authSource=admin".format(self.user, self.password, self.host, self.port, self.db_name))
        logging.debug("Connected to mongo!")

    def init_indexes(self):
        self.conn[self.db_name][self.service_collection].create_index("inn", unique=True)

    def close_conn(self):
        self.conn.close()
        self.conn = None

    def init_enums(self):
        jsons_path = './db/entity_enums'
        for f in os.listdir(jsons_path):
            js = loads(open(path.join(jsons_path, f), 'r').read())['config']
            self.conn[self.db_name][self.enums_collection].insert_many(js)

    def save_service(self, entity: dict) -> str:
        try:
            res = self.conn[self.db_name][self.service_collection].insert_one(entity)
        except Exception as e:
            logging.warn("Failed to insert service: {}".format(e))
            return ""
        return str(res.inserted_id)

    def save_services(self, entities: List[dict]):
        try:
            self.conn[self.db_name][self.service_collection].insert_many(entities)
        except Exception as e:
            logging.warn("Failed to insert services: {}".format(e))

    def save_company(self, entity: dict) -> str:
        try:
            res = self.conn[self.db_name][self.company_collection].insert_one(entity)
        except Exception as e:
            logging.warn("Failed to insert company: {}".format(e))
            return ""
        return str(res.inserted_id)

    def save_companies(self, entities: List[dict]):
        try:
            self.conn[self.db_name][self.company_collection].insert_many(entities)
        except Exception as e:
            logging.warn("Failed to insert companies: {}".format(e))

    def save_deals(self, entities: List[dict]):
        try:
            self.conn[self.db_name][self.deals_collection].insert_many(entities)
        except Exception as e:
            logging.warn("Failed to insert deals: {}".format(e))

    def edit_service(self, id: str, entity: dict) -> bool:
        try:
            self.conn[self.db_name][self.service_collection].update_one({'_id': ObjectId(id)}, {'$set': entity}, upsert=False)
        except Exception as e:
            logging.warn("Failed to edit entity: {}".format(e))
            return False
        return True

    def edit_company(self, id: str, entity: dict) -> bool:
        try:
            self.conn[self.db_name][self.company_collection].update_one({'_id': ObjectId(id)}, {'$set': entity}, upsert=False)
        except Exception as e:
            logging.warn("Failed to edit entity: {}".format(e))
            return False
        return True

    def get_service(self, id: str) -> Tuple[dict, bool]:
        try:
            res = self.conn[self.db_name][self.service_collection].find_one({'_id': ObjectId(id)})
        except Exception as e:
            logging.warn("Failed to find entity: {}".format(e))
            return {}, False
        if res is None:
            return {}, False
        return res, True

    def get_company(self, id: str) -> Tuple[dict, bool]:
        try:
            res = self.conn[self.db_name][self.company_collection].find_one({'_id': ObjectId(id)})
        except Exception as e:
            logging.warn("Failed to find entity: {}".format(e))
            return {}, False
        if res is None:
            return {}, False
        return res, True

    def get_all_entities_ids(self, type_filter: str = None) -> Tuple[List[dict], bool]:
        try:
            res = self.conn[self.db_name][self.service_collection].find({} if type_filter is None else {'type': type_filter}, {"_id": 1})
        except Exception as e:
            logging.warn("Failed get_all_entities_ids: {}".format(e))
            return [], False
        return [str(x['_id']) for x in res], True

    def get_all_companies_ids(self, type_filter: str = None) -> Tuple[List[dict], bool]:
        try:
            res = self.conn[self.db_name][self.service_collection].find({} if type_filter is None else {'type': type_filter}, {"_id": 1})
        except Exception as e:
            logging.warn("Failed get_all_entities_ids: {}".format(e))
            return [], False
        return [str(x['_id']) for x in res], True

    def get_companies(self) -> Tuple[List[dict], bool]:
        try:
            res = self.conn[self.db_name][self.company_collection].find()
        except Exception as e:
            logging.warn("Failed get_all_entities_ids: {}".format(e))
            return [], False
        return [x for x in res], True

    def get_services(self, filter_type=None) -> Tuple[List[dict], bool]:
        try:
            res = self.conn[self.db_name][self.service_collection].find({'type': filter_type} if filter_type is not None else None)
        except Exception as e:
            logging.warn("Failed get_all_entities_ids: {}".format(e))
            return [], False
        return [x for x in res], True

    def get_deals(self) -> Tuple[List[dict], bool]:
        try:
            res = self.conn[self.db_name][self.deals_collection].find()
        except Exception as e:
            logging.warn("Failed get_all_entities_ids: {}".format(e))
            return [], False
        return [x for x in res], True