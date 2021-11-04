import logging
from os import stat
from fastapi import FastAPI, Response, status
import pandas as pd
import numpy as np

from db.manager import DbManager
from .utils import *
from .model import *

import prediction.fund_predictor as fund_p
import prediction.type_predictor as type_p
from prediction.utils import load_services

def apply_handlers(app: FastAPI, db: DbManager):
    service_types = Union[VentureFundModel, AcceleratorModel, ProgressInstituteModel, EngeneeringCenterModel, BusinessIncubatorModel, CorporationModel]

    @app.get("/test", status_code=200, response_model=DefaultResponseModel[dict], include_in_schema=False)
    def test_handler():
        return success_response({'result': 'ok'})

    @app.get("/service", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def get_services(response: Response, type: str = None):
        """
        Возвращает список id сервисов, опционально фильтруя по GET параметру type
        """
        ent, ok = db.get_all_services_ids(type)
        if ok is False:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return error_response('failed to get entities')
        return success_response({'entities': ent})

    @app.get("/company", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def get_companies(response: Response):
        """
        Возвращает список id компаний
        """
        ent, ok = db.get_all_companies_ids()
        if ok is False:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return error_response('failed to get entities')
        return success_response({'entities': ent})

    @app.get("/service/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[service_types])
    def get_entity_by_id(id: str, response: Response):
        """
        Получить сущность по ее id
        """
        entity, ok = db.get_service(id)
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        
        if entity['type'] == 'VentureFund':
            data = VentureFundModel(**entity)
        elif entity['type'] == 'Accelerator':
            data = AcceleratorModel(**entity)
        elif entity['type'] == 'ProgressInstitute':
            data = ProgressInstituteModel(**entity)
        elif entity['type'] == 'EngeneeringCenter':
            data = EngeneeringCenterModel(**entity)
        elif entity['type'] == 'BusinessIncubator':
            data = BusinessIncubatorModel(**entity)
        elif entity['type'] == 'Corporation':
            data = CorporationModel(**entity)
        else:
            return error_response('Failed to find model for type={}'.format(entity['type']))
        return success_response(data)

    @app.get("/company/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[CompanyModel])
    def get_entity_by_id(id: str, response: Response, search_by: SearchByEnum = 'id'):
        """
        Получить компанию по ее id или ИНН
        """
        if search_by == SearchByEnum.inn:
            entity, ok = db.get_company_by_inn(id)
        else:
            entity, ok = db.get_company(id)

        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity by id={}'.format(id))
        
        if entity['type'] == 'Company':
            data = CompanyModel(**entity)
        else:
            response.status_code = status.HTTP_406_NOT_ACCEPTABLE
            return error_response('Failed to find model for type={}'.format(entity['type']))
        return success_response(data)

    @app.put("/company/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[CompanyModel])
    def update_company_by_id(entity: CompanyModel, id: str, response: Response):
        """
        Обновить компанию по id.
        """
        entity = entity.dict()
        data = CompanyModel(**entity)
        ok = db.edit_company(id, data.dict())
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        return success_response()

    @app.put("/service/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def update_service_by_id(entity: service_types, id: str, response: Response):
        """
        Обновить сервис по id.
        """
        entity = entity.dict()
        if entity['type'] == 'VentureFund':
            data = VentureFundModel(**entity)
        elif entity['type'] == 'Accelerator':
            data = AcceleratorModel(**entity)
        elif entity['type'] == 'ProgressInstitute':
            data = ProgressInstituteModel(**entity)
        elif entity['type'] == 'EngeneeringCenter':
            data = EngeneeringCenterModel(**entity)
        elif entity['type'] == 'BusinessIncubator':
            data = BusinessIncubatorModel(**entity)
        elif entity['type'] == 'Corporation':
            data = CorporationModel(**entity)
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Failed to find model for type={}'.format(entity['type']))
        ok = db.edit_service(id, data.dict())
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        return success_response()

    @app.post("/company", status_code=status.HTTP_201_CREATED, response_model=DefaultResponseModel[dict])
    def create_company(entity: CompanyModel, response: Response):
        """
        Создать запись о компании
        """
        entity = entity.dict()
        data = CompanyModel(**entity)
        id = db.save_company(data.dict())
        if id == "":
            response.status_code = status.HTTP_406_NOT_ACCEPTABLE
            return error_response('entity with such inn already exists')
        return success_response({'id': id})

    @app.post("/service", status_code=status.HTTP_201_CREATED, response_model=DefaultResponseModel[dict])
    def create_service(entity: service_types, response: Response):
        """
        Создать запись о сервисе
        """
        entity = entity.dict()
        if entity['type'] == 'VentureFund':
            data = VentureFundModel(**entity)
        elif entity['type'] == 'Accelerator':
            data = AcceleratorModel(**entity)
        elif entity['type'] == 'ProgressInstitute':
            data = ProgressInstituteModel(**entity)
        elif entity['type'] == 'EngeneeringCenter':
            data = EngeneeringCenterModel(**entity)
        elif entity['type'] == 'BusinessIncubator':
            data = BusinessIncubatorModel(**entity)
        elif entity['type'] == 'Corporation':
            data = CorporationModel(**entity)
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Failed to find model for type={}'.format(entity['type']))
        ok = db.save_service(id, data.dict())
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        return success_response()

    @app.post("/recommend", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def get_recommendation(entity: CompanyModel, response: Response):    
        """
        Получить рекомендации для компании по переданным данным
        """
        return produce_reco_response(entity)

    @app.get("/recommend/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def get_recommendation_search(id: str, response: Response, search_by: SearchByEnum = 'id'):    
        """
        Получить рекомендации для компании из базы по id либо по ИНН (без передачи данных)
        """
        if search_by == SearchByEnum.inn:
            entity, ok = db.get_company_by_inn(id)
        else:
            entity, ok = db.get_company(id)

        if ok is not True or entity is None:
            response.status_code = status.HTTP_404_NOT_FOUND
            logging.info('not found company with {}={}: {}'.format(search_by, id, entity))
            return error_response('failed to find company with {}={}: {}'.format(search_by, id, entity))
        
        return produce_reco_response(entity)

    def produce_reco_response(company: CompanyModel) -> DefaultResponseModel[dict]:
        comp_frame = pd.DataFrame(
            {k: v if isinstance(v, list) is False else str(v) for k, v in company.items()}, index=[0])
        services_frame = load_services(db)

        services_frame['_id'] = services_frame['_id'].astype(str)
        services_frame.drop_duplicates(subset=['_id'], inplace=True)

        reco_idxs, scores, important_values, metrics = fund_p.predict(comp_frame, services_frame)

        services_frame['score'] = scores
        services_frame = services_frame.iloc[reco_idxs].copy()

        imp_vals_cols = ['important_val_{}'.format(i) for i in range(1, 4)]
        services_frame[imp_vals_cols] = important_values[:, :3]
        return_cols = ['_id', 'name', 'type', 'score'] + imp_vals_cols

        logging.info(services_frame[return_cols].to_numpy().tolist())
        return success_response({
            # 'reco': {
            #     'funds': services_frame[services_frame['type'] == 'VentureFund'][return_cols].values.tolist(),
            #     'progressInstitute': services_frame[services_frame['type'] == 'ProgressInstitute'][return_cols].values.tolist(),
            #     'accelerators': services_frame[services_frame['type'] == 'Accelerator'][return_cols].values.tolist()
            # },
            'reco': services_frame[return_cols][services_frame['score'] > 0.5].fillna({'name': ''}).to_numpy().tolist(),
            'metrics': metrics
        })

