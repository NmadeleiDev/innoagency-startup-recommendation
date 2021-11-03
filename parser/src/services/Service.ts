import log from '../logger/logger';
import { IService, IServiceResult } from '../Models/NalogModel';

export class Service {
  private service: IService = null;
  constructor(serviceResult: IServiceResult, service?: IService) {
    try {
      this.service = {
        _id: '',

        startup_stage: service?.startup_stage,
        market: service?.market,
        services: service?.services,
        technologies: service?.technologies,
        investition_from_dol: service?.investition_from_dol,
        investition_to_dol: service?.investition_to_dol,
        tech_focus: service?.tech_focus,
        geography: service?.geography,
        study_format: service?.study_format,
        num_of_people_in_company_from: service?.num_of_people_in_company_from,
        num_of_people_in_company_to: service?.num_of_people_in_company_to,
        num_of_participants: service?.num_of_participants,

        inn: serviceResult.inn || serviceResult.basicInfo?.inn,
        name: serviceResult.basicInfo?.fullName || service?.name || undefined,
        shortName: serviceResult.basicInfo?.shortName,
        ogrn: serviceResult.basicInfo?.ogrn,
        address: {
          index: serviceResult.basicInfo?.index,
          region: serviceResult.basicInfo?.region,
          district: serviceResult.basicInfo?.district,
          city: serviceResult.basicInfo?.city,
          settlement: serviceResult.basicInfo?.settlement,
          street: serviceResult.basicInfo?.street,
          house: serviceResult.basicInfo?.house,
          building: serviceResult.basicInfo?.building,
          office: serviceResult.basicInfo?.office,
        },
        active: serviceResult.basicInfo?.active,
        primary: serviceResult.basicInfo?.primary,
        okved: serviceResult.basicInfo?.okved,
        okved2: serviceResult.basicInfo?.okved2,
        okopf: serviceResult.basicInfo?.okopf,
        okfs: serviceResult.basicInfo?.okfs,
        kpp: serviceResult.basicInfo?.kpp,
        registrationDate: serviceResult.basicInfo?.registrationDate,
        location: serviceResult.basicInfo?.location,
        authorizedCapital: serviceResult.basicInfo?.authorizedCapital,
        balance: serviceResult.details?.balance,
        financialResult: serviceResult.details?.financialResult,
        capitalChange: serviceResult.details?.capitalChange,
        fundsMovement: serviceResult.details?.fundsMovement,
      };
    } catch (e) {
      log.debug(serviceResult);
      log.error(e);
    }
  }

  getService() {
    return this.service;
  }
}
