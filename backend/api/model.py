from typing import List, Optional, Tuple, Generic, TypeVar, Union
from pydantic import BaseModel
from pydantic.generics import GenericModel
from datetime import datetime, date
from pandas import to_numeric, to_datetime, Timestamp
from numpy import nan_to_num
from enum import Enum


DataT = TypeVar('DataT')

class DefaultResponseModel(GenericModel, Generic[DataT]):
    status: bool
    error: Optional[str] = None
    data: Optional[DataT]

split_by_n1 = lambda x: [i for i in map(lambda x: x.strip().lower(), str(x).split('|')) if len(i) > 0]
split_by_n2 = lambda x: [i for i in map(lambda x: x.strip().lower(), str(x).split(';')) if len(i) > 0]
split_by_n3 = lambda x: [i for i in map(lambda x: x.strip().lower(), str(x).split(',')) if len(i) > 0]

placeholder_if_not_instanceof = lambda x, t, p: x if isinstance(x, t) else p
to_str = lambda x: str(x).strip().lower()
to_num = lambda x: nan_to_num(to_numeric(x, errors='coerce'))
to_dt = lambda x: placeholder_if_not_instanceof(to_datetime(x, errors='coerce'), Timestamp, datetime(1970, 1, 1))

class CommonEntityModel(BaseModel):
    inn: str
    name: Optional[str]

class CompanyModel(CommonEntityModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'ИНН': ('inn', to_str),
            'Наименование компании': ('name', to_str),

            'Наименование проекта, в рамках которого получил поддержку': ('got_support_from', to_str),
            'Получена поддержка': ('did_get_support', to_str),
            'Сервис': ('service', to_str),
            'Дата основания': ('foundation_date', to_dt),
            'Технологическая ниша компании для Инновационных компаний': ('tech_focus', split_by_n2),
            'Стадия развития компании для Инновационных компаний': ('stage_of_development', to_str),
            "Фильтр 'Рынок' для Инновационных компаний": ('market', split_by_n2),
            "Фильтр 'Технологии' для Инновационных компаний": ('technology', split_by_n2),
            'Бизнес-модель для Инновационных компаний': ('business_model', split_by_n2),
            'основной ОКВЭД': ('main_okved', to_str),
            'дополнительные ОКВЭДы': ('okved_secondary', split_by_n2),
            'Категория МСП': ('msp_category', to_str),
            'Экспортер': ('is_export', to_str),
            'Участник инновационного кластера города Москвы': ('inno_cluster_member', to_str),
            'Участник Сколково': ('skolcovo_member', to_str),
            'Инновационная компания': ('is_inno_company', to_str),
            'Стартап': ('is_startup', to_str),
            '2020-Чистая прибыль (строка 2400)': ('current_profit', to_num),
            '2020-Налог на прибыль (строка 2410)': ('current_profit_tax', to_num),
            '2020-Валовая прибыль (строка 2100)': ('current_revenue', to_num),
        }

        obj = CompanyModel(**{v[0]: v[1](record[k]) for k, v in naming_dict.items()})
        return obj

    type = 'Company'
    got_support_from: Optional[str]
    did_get_support: Optional[str]
    service: Optional[str]
    foundation_date: Optional[datetime]
    tech_focus: Optional[List[str]]
    stage_of_development: Optional[str]
    market: Optional[List[str]]
    technology: Optional[List[str]]
    business_model: Optional[List[str]]
    main_okved: Optional[str]
    okved_secondary: Optional[List[str]]
    msp_category: Optional[str]
    is_export: Optional[str]
    inno_cluster_member: Optional[str]
    skolcovo_member: Optional[str]
    is_inno_company: Optional[str]
    is_startup: Optional[str]
    current_profit: Optional[float]
    current_profit_tax: Optional[float]
    current_revenue: Optional[float]


class DealModel(BaseModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'Дата сделки (месяц)': ('deal_date', to_dt),
            'Наименование стартапа': ('startup_name', to_str),
            'ИНН': ('startup_inn', to_str),

            'Государственный фонд': ('gov_fund', split_by_n3),
            'Государственный фонд_сумма, долл': ('gov_fund_sum_dol', to_num),
            'Государственный фонд_сумма, руб': ('gov_fund_sum_rub', to_num),

            'Частный фонд': ('private_fund', split_by_n3),
            'Частный фонд_сумма, долл': ('private_fund_sum_dol', to_num),
            'Частный фонд_сумма, руб': ('private_fund_sum_rub', to_num),

            'Корпоративный фонд': ('corp_fund', split_by_n3),
            'Корпоративный фонд_сумма, долл': ('corp_fund_sum_dol', to_num),
            'Корпоративный фонд_сумма, руб': ('corp_fund_sum_rub', to_num),

            'Корпоративный инвестор': ('corp_investor', split_by_n3),
            'Корпоративный инвестор_сумма, долл': ('corp_investor_sum_dol', to_num),
            'Корпоративный инвестор_сумма, руб': ('corp_investor_sum_rub', to_num),

            'Бизнес-ангел': ('business_angel', split_by_n3),
            'Бизнес-ангел_сумма, долл': ('business_angel_sum_dol', to_num),
            'Бизнес-ангел_сумма, руб': ('business_angel_sum_rub', to_num),

            'Акселератор': ('accelerator', split_by_n3),
            'Акселератор_сумма, долл': ('accelerator_sum_dol', to_num),
            'Акселератор_сумма, руб': ('accelerator_sum_rub', to_num),

            'Итоговая сумма, долл': ('final_price_dol', to_num),
            'Итоговая сумма, руб': ('final_price_rub', to_num),

            'Раунд': ('round', to_str),
        }

        obj = DealModel(**{v[0]: v[1](record.get(k, None)) for k, v in naming_dict.items()})
        return obj

    deal_date: Optional[datetime]
    startup_name: Optional[str]
    startup_inn: Optional[str]

    gov_fund: Optional[List[str]]
    gov_fund_sum_dol: Optional[float]
    gov_fund_sum_rub: Optional[float]

    private_fund: Optional[List[str]]
    private_fund_sum_dol: Optional[float]
    private_fund_sum_rub: Optional[float]

    corp_fund: Optional[List[str]]
    corp_fund_sum_dol: Optional[float]
    corp_fund_sum_rub: Optional[float]

    corp_investor: Optional[List[str]]
    corp_investor_sum_dol: Optional[float]
    corp_investor_sum_rub: Optional[float]

    business_angel: Optional[List[str]]
    business_angel_sum_dol: Optional[float]
    business_angel_sum_rub: Optional[float]

    accelerator: Optional[List[str]]
    accelerator_sum_dol: Optional[float]
    accelerator_sum_rub: Optional[float]

    final_price_dol: Optional[float]
    final_price_rub: Optional[float]

    round: Optional[str]

# Дубль класса DealModel, но с дефолтом на тип покупок=вход, чтобы удобнее заносить в БД
class DealBuyModel(DealModel):
    @staticmethod
    def from_dataset(record: dict):
        return DealBuyModel(**DealModel.from_dataset(record).dict())
    deal_type: Optional[str] = 'buy'

# Дубль класса DealModel, но с дефолтом на тип покупок=выход, чтобы удобнее заносить в БД
class DealSellModel(DealModel):
    @staticmethod
    def from_dataset(record: dict):
        return DealSellModel(**DealModel.from_dataset(record).dict())
    deal_type: Optional[str] = 'sell'

class VentureFundModel(CommonEntityModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'ИНН организации': ('inn', lambda x: str(int(to_num(x)))),
            'Название объекта': ('name', to_str),

            'Стадия стартапа': ('startup_stage', split_by_n1),
            'Рынок': ('market', split_by_n1),
            'Сервисы': ('services', split_by_n1),
            'Технологии': ('technologies', split_by_n1),
            'Форма собственности': ('type_of_ownership', to_str),
            'Раунд инвестирования': ('investment_round', split_by_n1),
            'Объем инвестиций ОТ, $': ('investition_from_dol', to_num),
            'Объем инвестиций ДО, $': ('investition_to_dol', to_num),
            'Технологический фокус': ('tech_focus', split_by_n1),
            'Общий объем фондов, руб. млн': ('fund_total_rub', to_num),
            'Общий объем фондов, $ млн': ('fund_total_dol', to_num),
            'Количество инвестиций': ('num_of_investments', to_num),
            'Количество выходов': ('num_of_exits', to_num),
            'Описание': ('description', to_str),
        }

        obj = VentureFundModel(**{v[0]: v[1](record[k]) for k, v in naming_dict.items()})
        return obj

    type: str = 'VentureFund'
    description: Optional[str]
    startup_stage: Optional[List[str]]
    market: Optional[List[str]]
    services: Optional[List[str]]
    technologies: Optional[List[str]]
    type_of_ownership: Optional[str]
    investment_round: Optional[List[str]]
    investition_from_dol: Optional[float]
    investition_to_dol: Optional[float]
    tech_focus: Optional[List[str]]
    fund_total_rub: Optional[float]
    fund_total_dol: Optional[float]
    num_of_investments: Optional[float]
    num_of_exits: Optional[float]
    market_non_focus: Optional[List[str]]
    startup_stage_non_focus: Optional[List[str]]
    tech_focus_non_focus: Optional[List[str]]
    technologies_non_focus: Optional[List[str]]


class AcceleratorModel(CommonEntityModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'ИНН организатора': ('inn', lambda x: str(int(to_num(x)))),
            'Название программы': ('name', to_str),

            'Стадия стартапа': ('startup_stage', split_by_n1),
            'Рынок': ('market', split_by_n1),
            'Сервисы': ('services', split_by_n1),
            'Технологии': ('technologies', split_by_n1),
            'Объем инвестиций ОТ, $': ('investition_from_dol', to_num),
            'Объем инвестиций ДО, $': ('investition_to_dol', to_num),
            'Технологический фокус': ('tech_focus', split_by_n1),
            'География отбора': ('geography', split_by_n1),
            'Формат обучения': ('study_format', to_str),
            'Кол-во человек в команде, от': ('num_of_people_in_company_from', to_num),
            'Кол-во человек в команде, до': ('num_of_people_in_company_to', to_num),
            'Участники': ('num_of_participants', to_num),
            'Описание': ('description', to_str),

        }

        obj = AcceleratorModel(**{v[0]: v[1](record[k]) for k, v in naming_dict.items()})
        return obj

    type: str = 'Accelerator'
    description: Optional[str]
    startup_stage: Optional[List[str]]
    market: Optional[List[str]]
    services: Optional[List[str]]
    technologies: Optional[List[str]]
    investition_from_dol: Optional[float]
    investition_to_dol: Optional[float]
    tech_focus: Optional[List[str]]
    geography: Optional[List[str]]
    study_format: Optional[str]
    num_of_people_in_company_from: Optional[int]
    num_of_people_in_company_to: Optional[int]
    num_of_participants: Optional[int]


class BusinessIncubatorModel(CommonEntityModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'ИНН организации': ('inn', lambda x: str(int(to_num(x)))),
            'Организация полное название': ('name', to_str),

            'Стадия стартапа': ('startup_stage', split_by_n1),
            'Рынок': ('market', split_by_n1),
            'Сервисы': ('services', split_by_n1),
            'Технологии': ('technologies', split_by_n1),
            'Форма собственности': ('type_of_ownership', to_str),
            'Технологический фокус': ('tech_focus', split_by_n1),
            'Описание': ('description', to_str),
        }

        obj = BusinessIncubatorModel(**{v[0]: v[1](record[k]) for k, v in naming_dict.items()})
        return obj

    type: str = 'BusinessIncubator'
    description: Optional[str]
    startup_stage: Optional[List[str]]
    market: Optional[List[str]]
    services: Optional[List[str]]
    technologies: Optional[List[str]]
    type_of_ownership: Optional[str]
    tech_focus: Optional[List[str]]

class ProgressInstituteModel(CommonEntityModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'ИНН организации': ('inn', lambda x: str(int(to_num(x)))),
            'Название объекта': ('name', to_str),

            'Стадия стартапа': ('startup_stage', split_by_n1),
            'Сервисы': ('services', split_by_n1),
            'Финансовая поддержка': ('monetary_support', split_by_n1)
            'Описание': ('description', to_str),

        }

        obj = ProgressInstituteModel(**{v[0]: v[1](record[k]) for k, v in naming_dict.items()})
        return obj

    type: str = 'ProgressInstitute'
    description: Optional[str]
    startup_stage: Optional[List[str]]
    services: Optional[List[str]]
    monetary_support: Optional[List[str]]


class EngeneeringCenterModel(CommonEntityModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'ИНН организации': ('inn', lambda x: str(int(to_num(x)))),
            'Название объекта': ('name', to_str),

            'Рынок': ('market', split_by_n1),
            'Сервисы': ('services', split_by_n1),
            'Технологии': ('technologies', split_by_n1),
            'Форма собственности': ('type_of_ownership', to_str),
            'Технологический фокус': ('tech_focus', split_by_n1),
            'Описание': ('description', to_str),

        }

        obj = EngeneeringCenterModel(**{v[0]: v[1](record[k]) for k, v in naming_dict.items()})
        return obj

    type: str = 'EngeneeringCenter'
    description: Optional[str]
    market: Optional[List[str]]
    services: Optional[List[str]]
    technologies: Optional[List[str]]
    type_of_ownership: Optional[str]
    tech_focus: Optional[List[str]]


class CorporationModel(CommonEntityModel):
    @staticmethod
    def from_dataset(record: dict):
        naming_dict = {
            'ИНН': ('inn', lambda x: str(int(to_num(x)))),
            'Сокращенное наименование': ('name', to_str),

            'Основной ОКВЭД': ('okved_main', to_str),
            'Дополнительные ОКВЭДы': ('okved_secondary', split_by_n2),
            'Стадия развития компании': ('corp_stage', to_str),
            'Рыночные ниши': ('market', split_by_n2),
            'Технологии': ('technologies', split_by_n2),
            'Бизнес-модель': ('business_model', split_by_n2),
            'Описание': ('description', to_str),
        }

        obj = CorporationModel(**{v[0]: v[1](record[k]) for k, v in naming_dict.items()})
        return obj

    type: str = 'Corporation'
    description: Optional[str]
    okved_main: Optional[str]
    okved_secondary: Optional[List[str]]
    corp_stage: Optional[str]
    market: Optional[List[str]]
    technologies: Optional[List[str]]
    business_model: Optional[List[str]]

class SearchByEnum(str, Enum):
    inn = 'inn'
    id = 'id'
