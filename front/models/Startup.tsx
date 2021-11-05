export interface CompanyModel {
  type: 'Company';
  id: string;
  inn: string;
  name: string;
  got_support_from: string;
  did_get_support: string;
  service: string;
  foundation_date: string;
  tech_focus: string[];
  stage_of_development: string;
  market: string[];
  technology: string[];
  business_model: string[];
  main_okved: string;
  okved_secondary: string[];
  msp_category: string;
  is_export: string;
  inno_cluster_member: string;
  skolcovo_member: string;
  is_inno_company: string;
  is_startup: string;
  current_profit: number;
  current_profit_tax: number;
  current_revenue: number;
}

export type KeyValue = { id: string; text: string };

export const markets: KeyValue[] = [
  { id: '1000', text: 'Advertising & Marketing' },
  { id: '1001', text: 'AgroTech' },
  { id: '1002', text: 'Business Software' },
  { id: '1003', text: 'CleanTech' },
  { id: '1004', text: 'Consumer Goods & Services' },
  { id: '1005', text: 'Cybersecurity' },
  { id: '1006', text: 'E-commerce' },
  { id: '1007', text: 'EdTech' },
  { id: '1008', text: 'Entertainment' },
  { id: '1009', text: 'FashionTech' },
  { id: '1010', text: 'FinTech' },
  { id: '1011', text: 'FoodTech' },
  { id: '1012', text: 'Gaming' },
  { id: '1013', text: 'Healthcare' },
  { id: '1014', text: 'HRTech' },
  { id: '1015', text: 'IndustrialTech' },
  { id: '1016', text: 'InsuranceTech' },
  { id: '1017', text: 'LegalTech' },
  { id: '1018', text: 'Мedia & Communication' },
  { id: '1019', text: 'PropTech' },
  { id: '1020', text: 'RetailTech' },
  { id: '1021', text: 'SafetyTech' },
  { id: '1022', text: 'SpaceTech' },
  { id: '1023', text: 'SportTech' },
  { id: '1024', text: 'Telecom' },
  { id: '1025', text: 'Transport & Logistics' },
  { id: '1026', text: 'Travel' },
];

export const technologies: KeyValue[] = [
  { id: '1100', text: '3D моделирование' },
  { id: '1101', text: 'AR/VR' },
  { id: '1102', text: 'Big Data' },
  { id: '1103', text: 'Аддитивные технологии' },
  { id: '1104', text: 'Беспилотники' },
  { id: '1105', text: 'Биометрия' },
  { id: '1106', text: 'Биотехнологии' },
  { id: '1107', text: 'Блокчейн' },
  { id: '1108', text: 'Зеленые технологии' },
  { id: '1109', text: 'Интернет вещей' },
  { id: '1110', text: 'Искусственный интеллект и машинное обучение' },
  { id: '1111', text: 'Компьютерное зрение' },
  { id: '1112', text: 'Нанотехнологии' },
  { id: '1113', text: 'Нейротехнологии' },
  { id: '1114', text: 'Новые и портативные источники энергии' },
  { id: '1115', text: 'Новые материалы' },
  { id: '1116', text: 'Робототехника' },
];

export const techFocus: KeyValue[] = [
  { id: '2300', text: 'edtech' },
  { id: '2301', text: 'fintech' },
  { id: '2302', text: 'телекоммуникации' },
  { id: '2303', text: 'healthtech' },
  { id: '2304', text: 'консалтинг' },
  { id: '2305', text: 'транспорт и логистика' },
  { id: '2306', text: 'biotech' },
  { id: '2307', text: 'медиа и коммуникации' },
  { id: '2308', text: 'hrtech' },
  { id: '2309', text: 'туризм' },
  { id: '2310', text: 'промышленность и индустрия 4.0' },
  { id: '2311', text: 'недвижимость и строительство' },
  { id: '2312', text: 'retailtech и e-commerce' },
  { id: '2313', text: 'услуги для населения' },
  { id: '2314', text: 'спорт' },
  { id: '2315', text: 'экология' },
  { id: '2316', text: 'мода' },
  { id: '2317', text: 'безопасность' },
  { id: '2318', text: 'страхование' },
  { id: '2319', text: 'маркетинг и реклама' },
  { id: '2320', text: 'энергетика' },
  { id: '2321', text: 'foodtech' },
  { id: '2322', text: 'космос' },
  { id: '2323', text: 'развлечения' },
  { id: '2324', text: 'игры' },
  { id: '2325', text: 'ит, разработка по' },
];

export const msp: KeyValue[] = [
  { id: '', text: '' },
  { id: 'ип микро', text: 'ИП микро' },
  { id: 'ип малое', text: 'ИП малое' },
  { id: 'юл микро', text: 'ЮЛ микро' },
  { id: 'юл малое', text: 'ЮЛ малое' },
  { id: 'юл среднее', text: 'ЮЛ среднее' },
];

export const yesNo: KeyValue[] = [
  { id: '', text: '' },
  { id: 'да', text: 'да' },
  { id: 'нет', text: 'нет' },
];

export const businessModels: KeyValue[] = [
  { id: '1300', text: 'B2C' },
  { id: '1301', text: 'B2B' },
  { id: '1302', text: 'B2B2C' },
  { id: '1303', text: 'B2G' },
  { id: '1304', text: 'P2P' },
];

export const investmentRound: KeyValue[] = [
  { id: '1400', text: 'pre-seed' },
  { id: '1401', text: 'seed' },
  { id: '1402', text: 'stageA' },
  { id: '1403', text: 'stageB' },
  { id: '1404', text: 'stageC' },
];

export const progectStage: KeyValue[] = [
  { id: '', text: '' },
  { id: '1500', text: 'Идея' },
  { id: '1501', text: 'Посевная' },
  { id: '1502', text: 'Ранний рост' },
  { id: '1503', text: 'Расширение' },
];

export const investorType: KeyValue[] = [
  { id: '1600', text: 'ЧАСТНЫЙ ФОНД' },
  { id: '1601', text: 'КОРПОРАТИВНЫЙ ФОНД' },
  { id: '1602', text: 'ГОСУДАРСТВЕННЫЙ ФОНД' },
  { id: '1603', text: 'АКСЕЛЕРАТОР' },
];
export type ServiceType =
  | 'VentureFund'
  | 'Accelerator'
  | 'ProgressInstitute'
  | 'EngeneeringCenter'
  | 'BusinessIncubator'
  | 'Corporation';
export interface ServiceModel {
  type: ServiceType;
  inn: string;
  name: string;
  description?: string;
  market_non_focus: string[] | null;
  startup_stage_non_focus: string[] | null;
  tech_focus_non_focus: string[] | null;
  technologies_non_focus: string[] | null;
}

export interface VentureFondModel extends ServiceModel {
  type: 'VentureFund';
  type_of_ownership?: string;
  investment_round?: string[];
  investition_from_dol?: number;
  investition_to_dol?: number;
  tech_focus?: string[];
  fund_total_rub?: number;
  fund_total_dol?: number;
  num_of_investments?: number;
  num_of_exits?: number;
  startup_stage?: string[];
  market?: string[];
  services?: string[];
  technologies?: string[];
}

export const ventureFondType: KeyValue[] = [
  { id: '1700', text: 'Частный' },
  { id: '1701', text: 'Государственный' },
  { id: '1702', text: 'Корпоративный' },
  { id: '1703', text: 'Университетский' },
];
export const ventureFondCountry: KeyValue[] = [
  { id: '1800', text: 'Российский' },
  { id: '1801', text: 'Иностранный' },
];

export interface AcceleratorModel extends ServiceModel {
  type: 'Accelerator';
  startup_stage?: string[];
  market?: string[];
  services?: string[];
  technologies?: string[];
  investition_from_dol?: number;
  investition_to_dol?: number;
  tech_focus?: string[];
  geography?: number;
  study_format?: string;
  num_of_people_in_company_from?: number;
  num_of_people_in_company_to?: number;
  num_of_participants?: number;
}

export const programStatus: KeyValue[] = [
  { id: '1900', text: 'Идет набор участников' },
  { id: '1901', text: 'Идет программа' },
  { id: '1902', text: 'Программа закрыта - ожидайте следующий набор' },
];

export const participationConditions: KeyValue[] = [
  { id: '2000', text: 'Бесплатно' },
  { id: '2001', text: 'Платно' },
  { id: '2002', text: 'Доля в компании' },
];

export interface BusinessIncubatorModel extends ServiceModel {
  type: 'BusinessIncubator';
  startup_stage?: string[];
  market?: string[];
  services?: string[];
  technologies?: string[];
  type_of_ownership?: string;
  tech_focus?: string[];
}

export interface EngeneeringCenterModel extends ServiceModel {
  type: 'EngeneeringCenter';
  market?: string[];
  services?: string[];
  technologies?: string[];
  type_of_ownership?: string;
  tech_focus?: string[];
}

// export interface CoworkingModel extends ServiceModel {
//   type: 'Coworking';
//   investition_from_dol?: number;
//   investition_to_dol?: number;
//   tech_focus?: string[];
//   geography?: number;
//   study_format?: string;
//   num_of_people_in_company_from?: number;
//   num_of_people_in_company_to?: number;
//   num_of_participants?: number;
//   market_non_focus: string[] | null;
//   startup_stage_non_focus: string[] | null;
//   tech_focus_non_focus: string[] | null;
//   technologies_non_focus: string[] | null;
// }

export const coworkingFormat: KeyValue[] = [
  { id: '2100', text: 'Незакрепленные рабочие места' },
  { id: '2101', text: 'Закрепленные рабочие места' },
  { id: '2102', text: 'Мини-офисы' },
];

export const coworkingServices: KeyValue[] = [
  { id: '2200', text: 'Переговорная' },
  { id: '2201', text: 'Конференц-зал' },
  { id: '2202', text: 'Кухня' },
  { id: '2203', text: 'Зона отдыха' },
  { id: '2204', text: 'Ресепшн' },
  { id: '2205', text: 'Детская игровая комната' },
  { id: '2206', text: 'Локеры' },
  { id: '2207', text: 'Печать и сканирование' },
  { id: '2208', text: 'Доступ 24/7' },
  { id: '2209', text: 'Партнерские программы' },
  { id: '2210', text: 'Юридический адрес' },
  { id: '2211', text: 'Мероприятия' },
];

export interface ProgressInstituteModel extends ServiceModel {
  type: 'ProgressInstitute';
  startup_stage?: string[];
  services?: string[];
  monetary_support?: string[];
}

export interface CorporationModel extends ServiceModel {
  type: 'Corporation';
  okved_main?: string;
  okved_secondary?: string[];
  corp_stage?: string;
  market?: string[];
  technologies?: string[];
  business_model?: string[];
}
