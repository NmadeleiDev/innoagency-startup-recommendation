from os import path
import pandas as pd

from .manager import DbManager
from api.model import *

DATASET_PATH = '/dataset'

def copy_local_dataset_to_db():
    deals = pd.read_excel(path.join(DATASET_PATH, 'Венчурные сделки 2017-2021.xlsx'), sheet_name=None, parse_dates=['Дата сделки (месяц)'])
    deals_buys = deals['Москва_Сделки']
    exits = deals['Москва_Выходы']
    services = pd.read_excel(path.join(DATASET_PATH, 'Объекты-сервисы и потребности.xlsx'), sheet_name=None, dtype={
        'Технологический фокус': str,
    })
    companies = pd.read_excel(path.join(DATASET_PATH, 'Компании и поддержка.xlsx'), parse_dates=['Дата основания'])

    db = DbManager()
    db.init_connection()

    fillna_serv = {**{x: '' for x in services['Список венчурных фондов'].select_dtypes(['object'])}, **{x: 0 for x in services['Список венчурных фондов'].select_dtypes(['number'])}}

    fillna_comp = {**{x: '' for x in companies.select_dtypes(['object'])}, **{x: 0 for x in companies.select_dtypes(['number'])}}

    fillna_deals = {**{x: '' for x in deals_buys.select_dtypes(['object'])}, **{x: 0 for x in deals_buys.select_dtypes(['number'])}}
    fillna_exits = {**{x: '' for x in exits.select_dtypes(['object'])}, **{x: 0 for x in exits.select_dtypes(['number'])}}

    db.save_deals([DealBuyModel.from_dataset(x).dict() for x in deals['Москва_Сделки'].fillna(fillna_deals).to_dict(orient='records')])
    db.save_deals([DealBuyModel.from_dataset(x).dict() for x in deals['Россия'].fillna(fillna_deals).to_dict(orient='records')])
    db.save_deals([DealBuyModel.from_dataset(x).dict() for x in deals['Другие страны'].fillna(fillna_deals).to_dict(orient='records')])
    db.save_deals([DealSellModel.from_dataset(x).dict() for x in deals['Москва_Выходы'].fillna(fillna_exits).to_dict(orient='records')])

    db.save_services([VentureFundModel.from_dataset(x).dict() for x in services['Список венчурных фондов'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_services([AcceleratorModel.from_dataset(x).dict() for x in services['Список акселераторов'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_services([BusinessIncubatorModel.from_dataset(x).dict() for x in services['Список бизнес-инкубаторов'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_services([EngeneeringCenterModel.from_dataset(x).dict() for x in services['Список инжиниринговых центров'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_services([CorporationModel.from_dataset(x).dict() for x in services['Список корпораций'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_services([ProgressInstituteModel.from_dataset(x).dict() for x in services['Список институтов развития'].fillna(fillna_serv).to_dict(orient='records')])

    db.save_companies([CompanyModel.from_dataset(x).dict() for x in companies.fillna(fillna_comp).to_dict(orient='records')])

    db.close_conn()