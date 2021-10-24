import logging
from os import stat
from fastapi import FastAPI, Response, status
import pandas as pd

from db.manager import DbManager
from .utils import *
from .model import *

import prediction.fund_predictor as fund_p
import prediction.type_predictor as type_p
from prediction.utils import load_services


def apply_handlers(app: FastAPI, db: DbManager):
    possible_types = Union[CompanyModel, VentureFundModel, AcceleratorModel, ProgressInstituteModel, EngeneeringCenterModel, BusinessIncubatorModel, CorporationModel]

    @app.get("/test", status_code=200, response_model=DefaultResponseModel[dict], include_in_schema=False)
    def test_handler():
        return success_response({'result': 'ok'})

    @app.get("/entity", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def get_entities(response: Response, type: str = None):
        """
        Возвращает список id сущностей, опционально фильтруя по GET параметру type
        """
        ent, ok = db.get_all_entities_ids(type)
        if ok is False:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return error_response('failed to get entities')
        return success_response({'entities': ent})

    @app.get("/entity/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[possible_types])
    def get_entity_by_id(id: str, response: Response):
        """
        Получить сущность по ее id
        """
        entity, ok = db.get_entity(id)
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
            return error_response('Failed to find model for type={}'.format(b['type']))
        return success_response(data.dict())

    @app.put("/company/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def update_company_by_id(entity: possible_types, id: str, response: Response):
        """
        Обновить компанию по id.
        """
        entity = entity.dict()
        data = CompanyModel(**entity)
        ok = db.edit_entity(id, data.dict())
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        return success_response()

    @app.put("/service/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def update_service_by_id(entity: possible_types, id: str, response: Response):
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
        ok = db.edit_entity(id, data.dict())
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        return success_response()

    @app.post("/company", status_code=status.HTTP_201_CREATED, response_model=DefaultResponseModel[dict])
    def create_comapny(entity: CompanyModel, response: Response):
        """
        Создать запись о компании
        """
        entity = entity.dict()
        data = CompanyModel(**entity)
        id = db.save_service(data.dict())
        if id == "":
            response.status_code = status.HTTP_406_NOT_ACCEPTABLE
            return error_response('entity with such inn already exists')
        return success_response({'id': id})

    @app.post("/service", status_code=status.HTTP_201_CREATED, response_model=DefaultResponseModel[dict])
    def create_service(entity: VentureFundModel, response: Response):
        """
        Создать запись о сервисе
        """
        entity = entity.dict()
        data = CompanyModel(**entity)
        id = db.save_service(data.dict())
        if id == "":
            response.status_code = status.HTTP_406_NOT_ACCEPTABLE
            return error_response('entity with such inn already exists')
        return success_response({'id': id})

    @app.post("/recommend", status_code=status.HTTP_201_CREATED, response_model=DefaultResponseModel[dict])
    def get_reccomendation(entity: CompanyModel, response: Response):    
        """
        Получить рекомендации для компании
        """

        comp_frame = pd.DataFrame(entity.dict(), index=[0])
        services_frame = load_services()

        reco_idxs = fund_p.predict(comp_frame, services_frame)

        services_frame = services_frame.iloc[reco_idxs]

        return success_response({
            'funds': services_frame[services_frame['type'] == 'VentureFund']['_id'].values,
            'progressInstitute': services_frame[services_frame['type'] == 'ProgressInstitute']['_id'].values,
            'accelerators': services_frame[services_frame['type'] == 'VentureFund']['_id'].values})

    @app.get("/recommend/{id}", status_code=status.HTTP_201_CREATED, response_model=DefaultResponseModel[dict])
    def get_reccomendation_by_id(id: str, response: Response):    
        """
        Получить рекомендации для компании по id (без передачи данных)
        """
        entity, ok = db.get_entity(id)
        if ok is False or entity[type] != 'Company':
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find comapny with id={}'.format(id))
        comp_frame = pd.DataFrame(entity.dict(), index=[0])
        services_frame = load_services()

        reco_idxs = fund_p.predict(comp_frame, services_frame)

        services_frame = services_frame.iloc[reco_idxs]

        return success_response({
            'funds': services_frame[services_frame['type'] == 'VentureFund']['_id'].values,
            'progressInstitute': services_frame[services_frame['type'] == 'ProgressInstitute']['_id'].values,
            'accelerators': services_frame[services_frame['type'] == 'VentureFund']['_id'].values})


