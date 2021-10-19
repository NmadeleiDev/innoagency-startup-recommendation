export interface StartupModel {
  type: 'Startup';
  id: number;
  inn: string;
  companyName: string;
  foundationDate: number;
  companyDescription: string;
  logo?: string;
  tags?: {
    markets?: number[];
    technologies?: number[];
    businessModel?: number[];
  };
  details: {
    teamSize: number;
    projectStage: number;
    companyCity: string;
    companyProducts?: string[];
    investmentRound?: number;
  };
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
  owner?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    age: number;
    marriage?: boolean;
  };
}

export type KeyValue = { id: number; text: string };

export const markets: KeyValue[] = [
  { id: 1000, text: 'Advertising & Marketing' },
  { id: 1001, text: 'AgroTech' },
  { id: 1002, text: 'Business Software' },
  { id: 1003, text: 'CleanTech' },
  { id: 1004, text: 'Consumer Goods & Services' },
  { id: 1005, text: 'Cybersecurity' },
  { id: 1006, text: 'E-commerce' },
  { id: 1007, text: 'EdTech' },
  { id: 1008, text: 'Entertainment' },
  { id: 1009, text: 'FashionTech' },
  { id: 1010, text: 'FinTech' },
  { id: 1011, text: 'FoodTech' },
  { id: 1012, text: 'Gaming' },
  { id: 1013, text: 'Healthcare' },
  { id: 1014, text: 'HRTech' },
  { id: 1015, text: 'IndustrialTech' },
  { id: 1016, text: 'InsuranceTech' },
  { id: 1017, text: 'LegalTech' },
  { id: 1018, text: 'Мedia & Communication' },
  { id: 1019, text: 'PropTech' },
  { id: 1020, text: 'RetailTech' },
  { id: 1021, text: 'SafetyTech' },
  { id: 1022, text: 'SpaceTech' },
  { id: 1023, text: 'SportTech' },
  { id: 1024, text: 'Telecom' },
  { id: 1025, text: 'Transport & Logistics' },
  { id: 1026, text: 'Travel' },
];

export const technologies: KeyValue[] = [
  { id: 1100, text: '3D моделирование' },
  { id: 1101, text: 'AR/VR' },
  { id: 1102, text: 'Big Data' },
  { id: 1103, text: 'Аддитивные технологии' },
  { id: 1104, text: 'Беспилотники' },
  { id: 1105, text: 'Биометрия' },
  { id: 1106, text: 'Биотехнологии' },
  { id: 1107, text: 'Блокчейн' },
  { id: 1108, text: 'Зеленые технологии' },
  { id: 1109, text: 'Интернет вещей' },
  { id: 1110, text: 'Искусственный интеллект и машинное обучение' },
  { id: 1111, text: 'Компьютерное зрение' },
  { id: 1112, text: 'Нанотехнологии' },
  { id: 1113, text: 'Нейротехнологии' },
  { id: 1114, text: 'Новые и портативные источники энергии' },
  { id: 1115, text: 'Новые материалы' },
  { id: 1116, text: 'Робототехника' },
];

export const businessModels: KeyValue[] = [
  { id: 1300, text: 'B2C' },
  { id: 1301, text: 'B2B' },
  { id: 1302, text: 'B2B2C' },
  { id: 1303, text: 'B2G' },
  { id: 1304, text: 'P2P' },
];

export const investmentRound: KeyValue[] = [
  { id: 1400, text: 'pre-seed' },
  { id: 1401, text: 'seed' },
  { id: 1402, text: 'stageA' },
  { id: 1403, text: 'stageB' },
  { id: 1404, text: 'stageC' },
];

export const progectStage: KeyValue[] = [
  { id: 1500, text: 'Идея' },
  { id: 1501, text: 'Посевная' },
  { id: 1502, text: 'Ранний рост' },
  { id: 1503, text: 'Расширение' },
];

export const investorType: KeyValue[] = [
  { id: 1600, text: 'ЧАСТНЫЙ ФОНД' },
  { id: 1601, text: 'КОРПОРАТИВНЫЙ ФОНД' },
  { id: 1602, text: 'ГОСУДАРСТВЕННЫЙ ФОНД' },
  { id: 1603, text: 'АКСЕЛЕРАТОР' },
];

export interface VentureFondModel {
  type: 'VentureFond';
  id: number;
  inn: string;
  companyName: string;
  companyDescription: string;
  // В анкете тут только год, но дальше есть дочерние фодны, там полная дата.
  // Предлагаю тут тоже сделать полную дату
  // а еще в анкете она находится в разделе "детали"
  // но, если делать childFonds массивом фондов, то дата создания должна быть тут
  foundationDate: number;
  fondCapital?: number; //объем фонда в миллионах долларов
  logo?: string;
  tags?: {
    averageCheque?: number[]; //два числа [от, до], в долларах
    markets?: number[];
    technologies?: number[];
  };
  details?: {
    investmentRound?: number;
    ventureFondType?: number;
    ventureFondCountry?: number;
    focus?: string; // ТЕХНОЛОГИЧЕСКИЙ ФОКУС ФОНДА, приоритеты инвестирования
    // следующее поле бы неплохо добавить в формате этого же интерфейса, но на сайте у них только 3 поля
    // childFonds: VentureFondModel[] - в идеале так надо
    // либо делать остальные поля необязательными, тогда пройдем по контракту
    childFonds: VentureFondModel[];
    // childFonds?: {
    //   companyName: string;
    //   fondCapital: number;
    //   foundationDate: number;
    // };
  };
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
}

export const ventureFondType: KeyValue[] = [
  { id: 1700, text: 'Частный' },
  { id: 1701, text: 'Государственный' },
  { id: 1702, text: 'Корпоративный' },
  { id: 1703, text: 'Университетский' },
];
export const ventureFondCountry: KeyValue[] = [
  { id: 1800, text: 'Российский' },
  { id: 1801, text: 'Иностранный' },
];

export interface AccelerationProgramModel {
  type: 'AccelerationProgram';
  id: number;
  companyName: string;
  companyDescription: string;
  services?: string[]; //ЧТО ПОЛУЧАЮТ СТАРТАПЫ В РАМКАХ ПРОГРАММЫ
  forWhom?: string[]; //ТРЕБОВАНИЯ К КОМПАНИЯМ-УЧАСТНИКАМ
  logo?: string;
  tags?: {
    markets?: number[];
    technologies?: number[];
  };
  details?: {
    focus?: string[]; //НАПРАВЛЕНИЯ ПОИСКА ПРОЕКТОВ
    programStatus?: number;
    participationConditions?: number;
    organizatorName?: string; //НАЗВАНИЕ ОРГАНИЗАТОРА (инициатор/заказчик программы)
    operatorName?: string; //НАЗВАНИЕ ОПЕРАТОРА (Помогает структурировать и провести программу)
    programStages: {
      stageDateApplications: number;
      stageDatePrepare: number;
      stageDateStart: number;
      stageDateDemo: number;
      stageDatePost: number; //количество месяцев
    };
  };
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
}

export const programStatus: KeyValue[] = [
  { id: 1900, text: 'Идет набор участников' },
  { id: 1901, text: 'Идет программа' },
  { id: 1902, text: 'Программа закрыта - ожидайте следующий набор' },
];

export const participationConditions: KeyValue[] = [
  { id: 2000, text: 'Бесплатно' },
  { id: 2001, text: 'Платно' },
  { id: 2002, text: 'Доля в компании' },
];

export interface BusinessIncubatorModel {
  type: 'BusinessIncubator';
  id: number;
  inn: string;
  companyName: string;
  companyDescription: string;
  foundationDate?: number;
  services?: string[]; //ЧТО ПОЛУЧАЮТ СТАРТАПЫ
  logo?: string;
  tags?: {
    markets?: number[];
    technologies?: number[];
  };
  details?: {
    focus?: string[];
    incubatorForWhom?: string;
  };
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
}

export interface EngeneeringCenterModel {
  type: 'EngeneeringCenter';
  id: number;
  inn: string;
  companyName: string;
  companyDescription: string;
  foundationDate?: number;
  services?: string[]; //ЧТО ПОЛУЧАЮТ СТАРТАПЫ
  logo?: string;
  tags?: {
    markets?: number[];
    technologies?: number[];
  };
  details?: {
    focus?: string[]; //ОТРАСЛЕВОЙ И ТЕХНОЛОГИЧЕСКИЙ ФОКУС
  };
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
}

export interface CoworkingModel {
  type: 'Coworking';
  id: number;
  inn: string;
  companyName: string;
  companyDescription: string;
  foundationDate?: number;
  logo?: string;
  details?: {
    address?: string;
    coworkingFormat?: number[]; // ФОРМАТЫ ПРОСТРАНСТВ
    coworkingServices?: number[]; // СЕРВИСЫ
    photos?: string[];
  };
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
}

export const coworkingFormat: KeyValue[] = [
  { id: 2100, text: 'Незакрепленные рабочие места' },
  { id: 2101, text: 'Закрепленные рабочие места' },
  { id: 2102, text: 'Мини-офисы' },
];

export const coworkingServices: KeyValue[] = [
  { id: 2200, text: 'Переговорная' },
  { id: 2201, text: 'Конференц-зал' },
  { id: 2202, text: 'Кухня' },
  { id: 2203, text: 'Зона отдыха' },
  { id: 2204, text: 'Ресепшн' },
  { id: 2205, text: 'Детская игровая комната' },
  { id: 2206, text: 'Локеры' },
  { id: 2207, text: 'Печать и сканирование' },
  { id: 2208, text: 'Доступ 24/7' },
  { id: 2209, text: 'Партнерские программы' },
  { id: 2210, text: 'Юридический адрес' },
  { id: 2211, text: 'Мероприятия' },
];

export interface InstituteModel {
  type: 'Institute';
  id: number;
  inn: string;
  companyName: string;
  companyDescription: string;
  foundationDate?: number;
  logo?: string;
  services?: string[]; //ЧТО ПОЛУЧАЮТ СТАРТАПЫ
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
}

export interface CorporateModel {
  type: 'Corporate';
  id: number;
  inn: string;
  companyName: string;
  companyDescription: string;
  foundationDate?: number;
  logo?: string;
  tags?: {
    markets?: number[];
    technologies?: number[];
  };
  details?: {
    focus?: string[]; //СФЕРА ТЕХНОЛОГИЧЕСКИХ ИНТЕРЕСОВ
    //ИНСТРУМЕНТЫ ИННОВАЦИЙ, название поля взял с сайта
    corporationInnovation?: {
      name: string;
      link: string;
    };
  };
  contacts: {
    corporationDevelopmentOfInnovations?: string;
    email: string;
    phone?: string;
    site: string;
  };
}
