import logging
from os import path
import pandas as pd
import numpy as np
from db.manager import DbManager
from api.model import *
import worker.parse_non_focus_investments as parse_non_focus_investments


DATASET_PATH = '/dataset'

def try_concat(arr):
    try:
        return np.concatenate(arr)
    except Exception as e:
        return []

def get_fund_strategy_faults(df):
    res = {
        'makret': set(try_concat(df['market__company'].values)) - set(try_concat(df['market__investor'].values)),
        'technologies': set(try_concat(df['technology__company'].values)) - set(try_concat(df['technologies__investor'].values)),
        'tech_focus': set(try_concat(df['tech_focus__company'].values)) - set(try_concat(df['tech_focus__investor'].values)),
        'startup_stage': set(df['stage_of_development__company'].values) - set(try_concat(df['startup_stage__investor'].values)),
    }
    return pd.Series(res)
    
def copy_local_dataset_to_db():
    logging.info("Copying data...")
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

    parse_non_focus_investments.parse_and_save()
    logging.info("DB initialized!")

    db.close_conn()