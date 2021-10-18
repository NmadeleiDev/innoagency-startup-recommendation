import logging
from os import stat
from fastapi import FastAPI, Response, status

from db.manager import DbManager
from .utils import *
from .model import *


def apply_handlers(app: FastAPI, db: DbManager):
    possible_types = Union[StartupModel, VentureFondModel, AccelerationProgramModel, CoworkingModel, EngeneeringCenterModel, BusinessIncubatorModel, CorporateModel]

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
        b, ok = db.get_entity(id)
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        
        if b['type'] == 'Startup':
            return success_response(StartupModel(**b))
        elif b['type'] == 'VentureFond':
            return success_response(VentureFondModel(**b))
        elif b['type'] == 'AccelerationProgram':
            return success_response(AccelerationProgramModel(**b))
        elif b['type'] == 'Coworking':
            return success_response(CoworkingModel(**b))
        elif b['type'] == 'EngeneeringCenter':
            return success_response(EngeneeringCenterModel(**b))
        elif b['type'] == 'BusinessIncubator':
            return success_response(BusinessIncubatorModel(**b))
        elif b['type'] == 'Corporate':
            return success_response(CorporateModel(**b))
        else:
            return error_response('Failed to find model for type={}'.format(b['type']))

    @app.put("/entity/{id}", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def update_entity_by_id(entity: possible_types, id: str, response: Response):
        """
        Обновить сущность по id. Принимает структуру любой сущности сервиса (StartupModel, VentureFondModel, AccelerationProgramModel, CoworkingModel, EngeneeringCenterModel, BusinessIncubatorModel, CorporateModel).
        """
        entity = entity.dict()
        if entity['type'] == 'Startup':
            data = StartupModel(**entity)
        elif entity['type'] == 'VentureFond':
            data = VentureFondModel(**entity)
        elif entity['type'] == 'AccelerationProgram':
            data = AccelerationProgramModel(**entity)
        elif entity['type'] == 'Coworking':
            data = CoworkingModel(**entity)
        elif entity['type'] == 'EngeneeringCenter':
            data = EngeneeringCenterModel(**entity)
        elif entity['type'] == 'BusinessIncubator':
            data = BusinessIncubatorModel(**entity)
        elif entity['type'] == 'Corporate':
            data = CorporateModel(**entity)
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Failed to find model for type={}'.format(entity['type']))
        ok = db.edit_entity(id, data.dict())
        if ok is False:
            response.status_code = status.HTTP_404_NOT_FOUND
            return error_response('failed to find entity')
        return success_response()

    @app.post("/entity", status_code=status.HTTP_201_CREATED, response_model=DefaultResponseModel[dict])
    def create_entity(entity: possible_types, response: Response):
        """
        Создать сущность. Принимает структуру любой сущности сервиса (StartupModel, VentureFondModel, AccelerationProgramModel, CoworkingModel, EngeneeringCenterModel, BusinessIncubatorModel, CorporateModel).
        Возвращает id созданной сущности.
        """
        entity = entity.dict()
        if entity['type'] == 'Startup':
            data = StartupModel(**entity)
        elif entity['type'] == 'VentureFond':
            data = VentureFondModel(**entity)
        elif entity['type'] == 'AccelerationProgram':
            data = AccelerationProgramModel(**entity)
        elif entity['type'] == 'Coworking':
            data = CoworkingModel(**entity)
        elif entity['type'] == 'EngeneeringCenter':
            data = EngeneeringCenterModel(**entity)
        elif entity['type'] == 'BusinessIncubator':
            data = BusinessIncubatorModel(**entity)
        elif entity['type'] == 'Corporate':
            data = CorporateModel(**entity)
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Failed to find model for type={}'.format(entity['type']))
        id = db.save_entity(data.dict())
        if id == "":
            response.status_code = status.HTTP_406_NOT_ACCEPTABLE
            return error_response('entity with such inn already exists')
        return success_response({'id': id})

