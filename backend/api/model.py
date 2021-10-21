from typing import List, Optional, Tuple, Generic, TypeVar, Union
from pydantic import BaseModel
from pydantic.generics import GenericModel
from datetime import datetime, date

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
    markets: Optional[List[str]]
    technologies: Optional[List[str]]
    businessModel: Optional[List[str]]
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
    sites: Optional[List[str]]

class BaseEntityModel(BaseModel):
    type: str
    inn: str
    companyName: Optional[str] = ''
    companyDescription: Optional[str] = ''
    logo: Optional[str] = ''
    contacts: Optional[EntityContacts] = None
    foundationDate: Optional[int]

class VentureFondDetails(BaseModel):
    investmentRound: Optional[str] = 0
    ventureFondType: Optional[str] = 0
    ventureFondCountry: Optional[str] = ''
    techFocus: Optional[List[str]]
    childFonds: Optional[List[BaseEntityModel]] = []
    technologies: Optional[List[str]]
    companyStages: Optional[List[str]] = None

class AccelerationProgramStages(BaseEntityModel):
    stageDateApplications: Optional[str]
    stageDatePrepare: Optional[str]
    stageDateStart: Optional[str]
    stageDateDemo: Optional[str]
    stageDatePost: Optional[str]

class AccelerationProgramDetails(BaseModel):
    participationConditions: Optional[str]
    organizatorName: Optional[str] = ''
    operatorName: Optional[str]
    techFocus: Optional[List[str]]
    technologies: Optional[List[str]]
    requirements: Optional[List[str]]
    market: Optional[List[str]]
    companyStages: Optional[List[str]] = None
    programStages: Optional[AccelerationProgramStages] = None

class BusinessIncubatorDetails(BaseModel):
    participationConditions: Optional[str] = ''
    techFocus: Optional[List[str]]
    technologies: Optional[List[str]]
    market: Optional[List[str]]
    companyStages: Optional[List[str]] = None
    incubatorForWhom: Optional[str] = ''

class EngeneeringCenterDetails(BaseModel):
    technologies: Optional[List[str]]
    market: Optional[List[str]]   
    techFocus: Optional[List[str]]

class CoworkingDetails(BaseModel):
    address: Optional[str] = ''
    coworkingFormat: Optional[List[str]] = []
    coworkingServices: Optional[List[str]] = []
    photos: Optional[List[str]] = []

class CorporationInnovationModel(BaseModel):
    name: Optional[str] = ''
    link: Optional[str] = ''

class CorporateDetails(BaseModel):
    technologies: Optional[List[str]]
    market: Optional[List[str]]   
    businessModel: Optional[str]
    okvedCodeMain: Optional[str]
    okvedCodeSecondary: Optional[List[str]]
    corporationInnovation: Optional[CorporationInnovationModel] = None

class CompanyModel(BaseEntityModel):
    tags: Optional[EntityTags] = None
    owner: Optional[PersonData] = None
    details: Optional[CompanyDetails] = None

class VentureFondModel(BaseEntityModel):
    fondCapitalMlnDollars: Optional[float]
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

class DealModel(BaseModel):
    dealDate: Optional[date]
    source: Optional[str]
    inn: Optional[str]
    govFund: Optional[str]
    corpFund: Optional[str]
    corpInvestor: Optional[str]
    businessAngel: Optional[str]
    foreginInvestor: Optional[str]
    finalDealPriceRub: Optional[float]
    finalDealPriceDollar: Optional[float]
    comments: Optional[str]

