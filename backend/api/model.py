from typing import List, Optional, Tuple, Generic, TypeVar, Union
from pydantic import BaseModel
from pydantic.generics import GenericModel

DataT = TypeVar('DataT')

class DefaultResponseModel(GenericModel, Generic[DataT]):
    status: bool
    error: Optional[str] = None
    data: DataT

class PersonData(BaseModel):
    name: Optional[str]
    lastname: Optional[str]
    middleName: Optional[str]
    age: Optional[int]
    marriage: Optional[bool]

class EntityTags(BaseModel):
    markets: Optional[List[int]]
    technologies: Optional[List[int]]
    businessModel: Optional[List[int]]
    averageCheque: Optional[List[int]]

class MetricHistory(BaseModel):
    ago0Period: Optional[float]
    ago1Period: Optional[float]
    ago2Period: Optional[float]

class CompanyDetails(BaseModel):
    companyProducts: Optional[List[str]]
    companyCity: Optional[str]
    okvedCodeMain: Optional[str]
    okvedCodeSecondary: Optional[List[str]]
    mspCategory: Optional[str]
    isInnovationCompany: Optional[bool]
    isStartup: Optional[bool]

    investments: Optional[MetricHistory]
    revenue: Optional[MetricHistory]
    quantityEmployeesMean: Optional[MetricHistory]

class EntityContacts(BaseModel):
    email: Optional[str]
    phone: Optional[str]
    site: Optional[str]

class BaseEntityModel(BaseModel):
    type: str
    inn: str
    companyName: Optional[str] = ''
    companyDescription: Optional[str] = ''
    logo: Optional[str] = ''
    contacts: Optional[EntityContacts] = None
    foundationDate: Optional[int]

class VentureFondDetails(BaseModel):
    investmentRound: Optional[int] = 0
    ventureFondType: Optional[int] = 0
    ventureFondCountry: Optional[str] = ''
    focus: Optional[str] = ''
    childFonds: Optional[List[BaseEntityModel]] = []

class AccelerationProgramStages(BaseEntityModel):
    stageDateApplications: Optional[int]
    stageDatePrepare: Optional[int]
    stageDateStart: Optional[int]
    stageDateDemo: Optional[int]
    stageDatePost: Optional[int]

class AccelerationProgramDetails(BaseModel):
    programStatus: Optional[int] = 0
    participationConditions: Optional[int] = 0
    organizatorName: Optional[str] = ''
    operatorName: Optional[str] = ''
    focus: Optional[str] = ''
    programStages: Optional[AccelerationProgramStages] = None

class BusinessIncubatorDetails(BaseModel):
    focus: Optional[List[str]] = []
    incubatorForWhom: Optional[str] = ''

class EngeneeringCenterDetails(BaseModel):
    focus: Optional[List[str]] = []    

class CoworkingDetails(BaseModel):
    address: Optional[str] = ''
    coworkingFormat: Optional[List[int]] = []
    coworkingServices: Optional[List[int]] = []
    photos: Optional[List[str]] = []

class CorporationInnovationModel(BaseModel):
    name: Optional[str] = ''
    link: Optional[str] = ''

class CorporateDetails(BaseModel):
    focus: Optional[List[str]] = []
    corporationInnovation: Optional[CorporationInnovationModel] = None

class CompanyModel(BaseEntityModel):
    tags: Optional[EntityTags] = None
    owner: Optional[PersonData] = None
    details: Optional[CompanyDetails] = None

class VentureFondModel(BaseEntityModel):
    fondCapital: Optional[float]
    details: Optional[VentureFondDetails] = None

class AccelerationProgramModel(BaseEntityModel):
    services: Optional[List[str]] = []
    forWhom: Optional[List[str]] = []
    details: Optional[AccelerationProgramDetails] = None

class BusinessIncubatorModel(BaseEntityModel):
    details: Optional[BusinessIncubatorDetails] = None

class EngeneeringCenterModel(BaseEntityModel):
    services: Optional[List[str]] = []
    details: Optional[EngeneeringCenterDetails] = None

class CoworkingModel(BaseEntityModel):
    details: Optional[CoworkingDetails] = None

class CorporateModel(BaseEntityModel):
    details: Optional[CorporateDetails] = None

