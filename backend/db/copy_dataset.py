# from os import path
# import pandas as pd

# from backend.db.manager import DbManager
# from backend.api.model import CompanyModel, CompanyDetails, EntityTags, PersonData, MetricHistory

# DATASET_PATH = '/dataset'

# def company_record_to_model(record) -> CompanyModel:
#     tags = EntityTags(markets=[], technologies=[], businessModel=[])
#     details = CompanyDetails(companyProducts=[], companyCity=[], okvedCodeMain=[], okvedCodeSecondary=[], mspCategory=[], isInnovationCompany=False, isStartup=False, investments=MetricHistory(), revenue=MetricHistory(), quantityEmployeesMean=MetricHistory())

#     return CompanyModel(type='company', inn=record['ИНН'], companyName=record['Наименование компании'], companyDescription=record[''], logo='', contacts='', foundationDate=0, tags=tags, details=details)

# def copy_local_dataset_to_db():
#     deals = pd.read_excel(path.join(DATASET_PATH, 'Венчурные сделки 2017-2021.xlsx'), sheet_name='Москва_Сделки')
#     services = pd.read_excel(path.join(DATASET_PATH, 'Объекты-сервисы и потребности.xlsx'), sheet_name=None)
#     companies = pd.read_excel(path.join(DATASET_PATH, 'Компании и поддержка.xlsx'))

#     db = DbManager()
#     db.init_connection()

    

#     db.close_conn()