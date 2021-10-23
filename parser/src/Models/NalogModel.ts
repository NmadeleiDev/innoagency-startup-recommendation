export interface IBFO {
  actives: null;
  actualBfoDate: null;
  actualCorrectionDate: string;
  actualCorrectionNumber: number;
  auditReport?: null;
  azFlg: false;
  clarification?: null;
  gainSum: number;
  id?: number;
  isCb: null;
  knd: string;
  period: string;
  publication: number;
  published: true;
  publishedCorrectionDate: null;
  publishedCorrectionNumber: null;
}

export interface IDataRow {
  '2017': null | number;
  '2018': null | number;
  '2019': null | number;
  '2020': null | number;
  id: string;
  column: string;
}

export interface ISearch {
  content: [
    {
      active: boolean;
      bfo: IBFO[];
      building: null;
      city: null;
      district: null;
      house: string;
      id: number;
      index: string;
      inn: string;
      office: string;
      ogrn: string;
      okato: null;
      okfs: { id: number; name: string };
      okopf: { id: number; name: string };
      okpo: string;
      okved: null;
      okved2: { id: string; name: string };
      primary: boolean;
      region: string;
      score: number;
      settlement: null;
      shortName: string;
    }
  ];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  facets: [];
  aggregations: null;
  scrollId: null;
  maxScore: string;
  totalPages: number;
  totalElements: number;
  sort: { unsorted: boolean; sorted: boolean; empty: boolean };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  empty: boolean;
}

export interface IBasicInfo {
  id: number;
  inn: string;
  shortName: string;
  ogrn: string;
  index: string;
  region: string;
  district: null;
  city: null;
  settlement: null;
  street: string;
  house: string;
  building: null;
  office: string;
  active: boolean;
  primary: boolean;
  okved: null;
  okved2: { id: string; name: string };
  okopf: { id: number; name: string };
  okfs: { id: number; name: string };
  bfo: IBFO[];
  okpo: string;
  okato: null;
  kpp: string;
  fullName: string;
  registrationDate: string;
  location: {
    id: number;
    name: string;
    code: number;
    latitude: number;
    longitude: number;
    type: number;
    parentId: number;
  };
  authorizedCapital: number;
}

export interface IDetails {
  id: number;
  balance: {
    [id: string]: IDataRow;
  };
  financialResult: {
    [id: string]: IDataRow;
  };
  capitalChange: {
    [id: string]: IDataRow;
  };
  fundsMovement: {
    [id: string]: IDataRow;
  };
  auditInn: string;
  auditName: string;
  auditOgrn: string;
  datePresent: string;
  period: string;
}
export interface IServiceResult {
  inn: string;
  search: ISearch;
  basicInfo: IBasicInfo;
  rowDetails?: any[];
  details: IDetails;
}

export interface IService {
  _id: string;
  inn: string;
  name: string;
  shortName?: string;
  ogrn?: string;
  startup_stage?: string[];
  market?: string[];
  services?: string[];
  technologies?: string[];
  investition_from_dol?: number;
  investition_to_dol?: number;
  tech_focus?: string[];
  geography?: string[];
  study_format?: string;
  num_of_people_in_company_from?: number;
  num_of_people_in_company_to?: number;
  num_of_participants?: number;
  address?: {
    index?: string;
    region?: string;
    district?: string;
    city?: string;
    settlement?: string;
    street?: string;
    house?: string;
    building?: string;
    office?: string;
  };
  active?: boolean;
  primary?: boolean;
  okved?: { id: string; name: string };
  okved2?: { id: string; name: string };
  okopf?: { id: number; name: string };
  okfs?: { id: number; name: string };
  kpp?: string;
  registrationDate?: string;
  location?: {
    id?: number;
    name?: string;
    code?: number;
    latitude?: number;
    longitude?: number;
    type?: number;
    parentId?: number;
  };
  authorizedCapital?: number;
  balance?: {
    [id: string]: IDataRow;
  };
  financialResult?: {
    [id: string]: IDataRow;
  };
  capitalChange?: {
    [id: string]: IDataRow;
  };
  fundsMovement?: {
    [id: string]: IDataRow;
  };
}
