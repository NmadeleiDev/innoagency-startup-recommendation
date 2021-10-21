from os import path
import pandas as pd

from .manager import DbManager
from api.model import AccelerationProgramDetails, BusinessIncubatorDetails, BusinessIncubatorModel, CompanyModel, CompanyDetails, CorporateDetails, CorporateModel, CoworkingDetails, CoworkingModel, DealModel, EngeneeringCenterDetails, EngeneeringCenterModel, EntityTags, PersonData, MetricHistory, EntityContacts, AccelerationProgramModel, AccelerationProgramStages, VentureFondDetails, VentureFondModel

DATASET_PATH = '/dataset'

def company_record_to_model(record: dict) -> CompanyModel:
    record.setdefault(None)
    tags = EntityTags(
        markets=record.get("Фильтр 'Рынок' для Инновационных компаний", '').split(";"), 
        technologies=record.get('Технологическая ниша компании для Инновационных компаний', '').split(";"), 
        businessModel=record.get('Бизнес-модель для Инновационных компаний', '').split(";"))
    details = CompanyDetails(
        companyProducts=record.get('Продукты компании', '').split(";"), 
        okvedCodeMain=record.get('основной ОКВЭД', None), 
        okvedCodeSecondary=record.get('дополнительные ОКВЭДы', '').split(";"), 
        mspCategory=record.get('Категория МСП', None), 
        isInnovationCompany=record.get('Инновационная компания', None), 
        isStartup=record.get('Стартап', None), 
        investments=MetricHistory(ago0Period=record.get('2019-Инвестиции', ''), ago1Period=record.get('2018-Инвестиции', ''), ago2Period=record.get('2017-Инвестиции', '')), 
        revenue=MetricHistory(ago0Period=record.get('2019-Выручка', ''), ago1Period=record.get('2018-Выручка', ''), ago2Period=record.get('2017-Выручка', '')), 
        quantityEmployeesMean=MetricHistory(ago0Period=record.get('2019-Среднесписочная численность', ''), ago1Period=record.get('2018-Среднесписочная численность', ''), ago2Period=record.get('2017-Среднесписочная численность', '')))

    return CompanyModel(type='company', inn=record.get('ИНН', ''), companyName=record.get('Наименование компании', ''), companyDescription=record.get('Описание', ''), logo=record.get('Логотип', ''), contacts=EntityContacts(sites=record.get('Сайты', '').split(";")), foundationDate=record.get('Дата основания', ''), tags=tags, details=details)

def acceleration_program_to_model(record: dict) -> AccelerationProgramModel:
    details=AccelerationProgramDetails(
        participationConditions=record.get('Условия участия', ''),  
        organizatorName=record.get('Организация полное название', ''), 
        operatorName=record.get('Оператор полное название', ''), 
        techFocus=record.get('Технологический фокус', '').split(';'), 
        technologies=record.get('Технологии', '').split('|'),
        requirements=record.get('Требования', '').split('|'),
        market=record.get('Рынок', '').split('|'),
        companyStages=record.get('Стадия стартапа', '').split('|'),
        programStages=AccelerationProgramStages(
            stageDateApplications=record.get('Прием заявок до', ''), 
            stageDatePrepare=record.get('Длит. акселерации, месяцы', ''),
            stageDateStart=record.get('Начало программы', ''),
            stageDateDemo=record.get('Demoday', ''),
            stageDatePost=record.get('После', '')
            )
    )

    return AccelerationProgramModel(
        name=record.get('Организация полное название', ''),
        inn=record.get('ИНН организации', ''),
        site=record.get('Сайт', ''),
        type='AccelerationProgram',
        services=record.get('Сервисы', '').split("|"), 
        details=details)

def venture_fond_to_model(record: dict) -> VentureFondModel:

    details=VentureFondDetails(
        investmentRound=record.get('Раунд инвестирования', ''),
        ventureFondType=record.get(''),
        techFocus=record.get('Технологический фокус', '').split(';'), 
        technologies=record.get('Технологии', '').split('|'),
        market=record.get('Рынок', '').split('|'),
        companyStages=record.get('Стадия стартапа', '').split('|'),
    )

    return VentureFondModel(
        name=record.get('Организация полное название', ''),
        type='VentureFond',
        inn=record.get('ИНН организации', ''),
        site=record.get('Сайт', ''),
        companyDescription=record.get('Описание', ''),
        fondCapitalMlnDollars=record.get('Общий объем фондов, $ млн', ''), 
        details=details)

def business_incubator_to_model(record: dict) -> BusinessIncubatorModel:
    details=BusinessIncubatorDetails(
        participationConditions=record.get('Условия участия(подробно)', ''),  
        organizatorName=record.get('Организация полное название', ''), 
        operatorName=record.get('Оператор полное название', ''), 
        techFocus=record.get('Технологический фокус', '').split(';'), 
        technologies=record.get('Технологии', '').split('|'),
        market=record.get('Рынок', '').split('|'),
        companyStages=record.get('Стадия стартапа', '').split('|'),
        incubatorForWhom=record.get('Для кого', ''),
    )

    return BusinessIncubatorModel(
        name=record.get('Организация полное название', ''),
        inn=record.get('ИНН организации', ''),
        type='BusinessIncubator',
        site=record.get('Сайт', ''),
        companyDescription=record.get('Описание', ''),
        details=details)

def engeneering_center_to_model(record: dict) -> EngeneeringCenterModel:
    details=EngeneeringCenterDetails(
        techFocus=record.get('Технологический фокус', '').split(';'), 
        technologies=record.get('Технологии', '').split('|'),
        market=record.get('Рынок', '').split('|'),
    )

    return EngeneeringCenterModel(
        name=record.get('Организация полное название', ''),
        inn=record.get('ИНН организации', ''),
        site=record.get('Сайт', ''),
        type='EngeneeringCenter',
        companyDescription=record.get('Описание', ''),
        services=record.get('Сервисы', '').split('|'),
        details=details)

def coworking_to_model(record: dict) -> CoworkingModel:
    return CoworkingModel(
        name=record.get('Организация полное название', ''),
        inn=record.get('ИНН организации', ''),
        type='Coworking',
        site=record.get('Сайт', ''),
        companyDescription=record.get('Описание', ''),
        services=record.get('Сервисы', '').split('|'))

def corporation_to_model(record: dict) -> CorporateModel:
    details=CorporateDetails(
        technologies=record.get('Технологии', '').split('|'),
        market=record.get('Рыночные ниши', '').split(';'),
        businessModel=record.get('Бизнес-модель', '').split(';'),
        okvedCodeMain=record.get('основной ОКВЭД', None), 
        okvedCodeSecondary=record.get('дополнительные ОКВЭДы', '').split(";"),
    )

    return CorporateModel(
        name=record.get('Организация полное название', ''),
        inn=record.get('ИНН', ''),
        type='Corporate',
        site=record.get('Сайт', ''),
        companyDescription=record.get('Описание', ''),
        services=record.get('Сервисы', '').split('|'),
        details=details)

def deal_to_model(record: dict) -> DealModel:

    return DealModel(
        dealDate=record.get('Дата сделки (месяц)', ''),
        source=record.get('Источник (ссылка)', ''),
        inn=record.get('ИНН', ''),
        govFund=record.get('Государственный фонд', ''),
        corpFund=record.get('Корпоративный фонд', ''),
        corpInvestor=record.get('Корпоративный инвестор', ''),
        businessAngel=record.get('Бизнес-ангел', ''),
        foreginInvestor=record.get('Иностранный инвестор', ''),
        finalDealPriceRub=record.get('Итоговая сумма,  руб', ''),
        finalDealPriceDollar=record.get('Итоговая сумма, долл', ''),
        comments=record.get('Комментарии', '')
    )

def copy_local_dataset_to_db():
    deals = pd.read_excel(path.join(DATASET_PATH, 'Венчурные сделки 2017-2021.xlsx'), sheet_name='Москва_Сделки', parse_dates=['Дата сделки (месяц)'])
    services = pd.read_excel(path.join(DATASET_PATH, 'Объекты-сервисы и потребности.xlsx'), sheet_name=None, dtype={
        'Технологический фокус': str,
    })
    companies = pd.read_excel(path.join(DATASET_PATH, 'Компании и поддержка.xlsx'), parse_dates=['Дата основания'])

    db = DbManager()
    db.init_connection()

    fillna_serv = {**{x: '' for x in services['Список венчурных фондов'].select_dtypes(['object'])}, **{x: 0 for x in services['Список венчурных фондов'].select_dtypes(['number'])}}

    fillna_comp = {**{x: '' for x in companies.select_dtypes(['object'])}, **{x: 0 for x in companies.select_dtypes(['number'])}}

    fillna_deals = {**{x: '' for x in deals.select_dtypes(['object'])}, **{x: 0 for x in deals.select_dtypes(['number'])}}

    db.save_entities([venture_fond_to_model(x) for x in services['Список венчурных фондов'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_entities([acceleration_program_to_model(x) for x in services['Список акселераторов'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_entities([business_incubator_to_model(x) for x in services['Список бизнес-инкубаторов'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_entities([engeneering_center_to_model(x) for x in services['Список инжиниринговых центров'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_entities([coworking_to_model(x) for x in services['Список коворкингов'].fillna(fillna_serv).to_dict(orient='records')])
    db.save_entities([corporation_to_model(x) for x in services['Список корпораций'].fillna(fillna_serv).to_dict(orient='records')])

    db.save_entities([corporation_to_model(x) for x in companies.fillna(fillna_comp).to_dict(orient='records')])
    
    db.save_entities([deal_to_model(x) for x in deals.fillna(fillna_deals).to_dict(orient='records')])

    db.close_conn()