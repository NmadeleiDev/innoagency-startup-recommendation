import { promises as fs } from 'fs';
import log from '../logger/logger';
// import { parse } from './parser';
import { parse } from 'node-html-parser';
import axios from 'axios';
import path from 'path/posix';
// const dir = "/Users/a18947461/Downloads/data-20211001-structure-20180801";

const logResult = (request: string, response: Object) => {
  log.debug(request);
  log.debug(response);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const convertToRows = (obj: any, columnNames: {}) =>
  Object.entries(obj).reduce((acc, cur) => {
    const number = cur[0].match(/\d+/)?.[0];
    if (!number) return acc;
    if (acc.length && acc[acc.length - 1].id === number) {
      if (cur[0].startsWith('current')) {
        acc[acc.length - 1].current = cur[1];
      } else if (cur[0].startsWith('previous')) {
        acc[acc.length - 1].previous = cur[1];
      } else if (cur[0].startsWith('beforePrevious')) {
        acc[acc.length - 1].beforePrevoius = cur[1];
      }
    } else {
      const column = columnNames[number];
      if (!column) return acc;
      const item = {
        id: number,
        current: null,
        previous: null,
        beforePrevoius: null,
        column,
      };
      if (cur[0].startsWith('current')) {
        item.current = cur[1];
      } else if (cur[0].startsWith('previous')) {
        item.previous = cur[1];
      } else if (cur[0].startsWith('beforePrevious')) {
        item.beforePrevoius = cur[1];
      }
      acc.push(item);
    }
    return acc;
  }, []);

const getColumnNames = async () => {
  log.info('parsing file');
  const html = await fs.readFile(path.join(__dirname, 'report.html'), 'utf-8');
  const dom = parse(html);
  const report = dom
    .querySelectorAll('.tabulator-selectable')
    .filter(
      (el) =>
        el.childNodes[1].innerText !== '&nbsp;' &&
        el.childNodes[1].innerText !== ''
    )
    .reduce(
      (acc, cur) => ({
        ...acc,
        [cur.childNodes[1].innerText]: cur.childNodes[0].innerText,
      }),
      {}
    );
  log.debug(report);
  return report;
};

// interface IServiceResult {
//   inn: 7707770166;
//   search: {
//     content: [[Object]];
//     pageable: {
//       sort: [Object];
//       pageNumber: 0;
//       pageSize: 20;
//       offset: 0;
//       unpaged: false;
//       paged: true;
//     };
//     facets: [];
//     aggregations: null;
//     scrollId: null;
//     maxScore: 'NaN';
//     totalPages: 1;
//     totalElements: 1;
//     sort: { unsorted: true; sorted: false; empty: true };
//     numberOfElements: 1;
//     first: true;
//     last: true;
//     size: 20;
//     number: 0;
//     empty: false;
//   };
//   basicInfo: {
//     id: 112772;
//     inn: '7707770166';
//     shortName: 'ООО "ВАЙТ ТРЕВЕЛ"';
//     ogrn: '1127746124989';
//     index: '127055';
//     region: 'МОСКВА';
//     district: null;
//     city: null;
//     settlement: null;
//     street: 'ПОРЯДКОВЫЙ';
//     house: '21';
//     building: null;
//     office: 'ОФИС 401';
//     active: true;
//     primary: true;
//     okved: null;
//     okved2: { id: '79.11'; name: 'Деятельность туристических агентств' };
//     okopf: { id: 12300; name: 'Общества с ограниченной ответственностью' };
//     okfs: { id: 23; name: 'Собственность иностранных юридических лиц' };
//     bfo: [[Object], [Object]];
//     okpo: '38365773';
//     okato: null;
//     kpp: '770701001';
//     fullName: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ВАЙТ ТРЕВЕЛ"';
//     registrationDate: '2012-02-24';
//     location: {
//       id: 7707;
//       name: 'Инспекция ФНС России № 7 по г. Москве';
//       code: 7707;
//       latitude: 55.761635;
//       longitude: 37.6586;
//       type: 'SONO';
//       parentId: 77;
//     };
//     authorizedCapital: 10000;
//   };
//   details: [
//     {
//       id: 10920445;
//       balance: [Array];
//       financialResult: [Array];
//       capitalChange: [Array];
//       fundsMovement: [Array];
//       simplified: false;
//       correctionVersion: 0;
//       lastCorrection: 1;
//       requiredAudit: 1;
//       auditInn: '7726242926';
//       auditName: 'ООО АКК "МОСКВА-АУДИТ"';
//       auditOgrn: '1027700556927';
//       errorsCount: 0;
//       resultCheckCs: [];
//       datePresent: '2021-03-31';
//       prBn: 0;
//       knd: '0710099';
//       period: '2020';
//     },
//     {
//       id: 6743570;
//       balance: [Array];
//       financialResult: [Array];
//       capitalChange: [Array];
//       fundsMovement: [Array];
//       simplified: false;
//       correctionVersion: 0;
//       lastCorrection: 1;
//       requiredAudit: 1;
//       auditInn: '7726242926';
//       auditName: 'ООО АКК "МОСКВА-АУДИТ"';
//       auditOgrn: '1027700556927';
//       errorsCount: 0;
//       resultCheckCs: [];
//       datePresent: '2020-03-23';
//       prBn: 0;
//       knd: '0710099';
//       period: '2019';
//     }
//   ];
// }

// const flattenDetails = (details) => {};

/**
 * сервис бух отчетности
 */
export class BONalogService {
  static async getInfoByInn(inn: number) {
    const info = {
      inn,
      search: null,
      basicInfo: null,
      details: [],
    };
    try {
      let search: any = await axios(
        `https://bo.nalog.ru/nbo/organizations/search?query=${inn}&page=0`
      );
      //   logResult(`Found data by INN ${inn}`, search.data);
      info.search = search.data;
      const id = search.data.content[0].id;
      if (!id) {
        return log.error('Id for INN %d not found!', inn);
      }

      const basicInfo: any = await axios(
        `https://bo.nalog.ru/nbo/organizations/${id}`
      );
      //   logResult(`Found basicInfo by ID ${id}`, basicInfo.data);
      info.basicInfo = basicInfo.data;

      const bfo: any = await axios(
        `https://bo.nalog.ru/nbo/organizations/${id}/bfo`
      );
      logResult(`Found bfo by ID ${id}`, bfo.data);
      const bfoIds: { id: number; period: string }[] = bfo.data.map((el) => ({
        id: el.id,
        period: el.period,
      }));
      log.debug(`Found bfo IDs:`, bfoIds);
      const columnNames = await getColumnNames();

      for (let bfoId of bfoIds) {
        const details: any = await axios(
          `https://bo.nalog.ru/nbo/bfo/${bfoId.id}/details`
        );
        logResult(
          `Found details by ID ${bfoId.id} and period ${bfoId.period}`,
          details.data
        );
        details.data[0].period = bfoId.period;
        const detailsCategories = [
          'balance',
          'financialResult',
          'capitalChange',
          'fundsMovement',
        ];
        detailsCategories.forEach((category) => {
          if (!details.data[0][category]) return;
          details.data[0][category] = convertToRows(
            details.data[0][category],
            columnNames
          );
        });
        // const detailsId = details.data[0].id;
        // const detailsCategories = [
        //   'balance',
        //   'financial_result',
        //   'capital_change',
        //   'funds_movement',
        // ];
        // const promises = detailsCategories.map(async (category) => {
        //   try {
        //     const categoryData = await axios(
        //       `https://bo.nalog.ru/nbo/details/${category}?id=${detailsId}`
        //     );
        //     logResult(
        //       `Found ${category} by ID ${detailsId}`,
        //       categoryData.data
        //     );
        //     return { category, data: categoryData.data };
        //   } catch (e) {
        //     log.error(`Error getting ${category}`, e);
        //     return null;
        //   }
        // });
        // //   log.debug('promises: ', promises);
        // const resolved = await Promise.all(promises);
        // console.log('resolved promises: ', resolved);
        // resolved.forEach((el) => {
        //   if (el?.data) details.data[0][el.category] = el.data;
        // });
        log.info(details.data[0]);
        info.details.push(details.data[0]);
        // delay(100);
      }
      log.debug(`Info by inn ${inn}\n'`, info);
      return info;
    } catch (e) {
      return log.error(e);
    }
  }
}
