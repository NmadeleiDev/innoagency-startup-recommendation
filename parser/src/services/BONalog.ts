import { promises as fs } from 'fs';
import log from '../logger/logger';
import { parse } from 'node-html-parser';
import path from 'path/posix';
import levenshtein from 'js-levenshtein';
import { delay, joinObjects } from '../server/utils';
import {
  IBasicInfo,
  IBFO,
  IContent,
  IDetails,
  ISearch,
  IServiceResult,
} from '../Models/NalogModel';
import columnNames from './names.json';
import { request } from '../server/axios';

/**
 * Converts data from this format
      expl1130: '',
      current1130: 68,
      previous1130: 135,
      beforePrevious1130: 10,
 * into object with categories
      "1230": {
        id: "1230",
        2017: 3565,
        2018: 567,
        2019: 7680,
        2020: 2756,
        column: "Дебиторская задолженность"
      }
 * @param obj raw data from TaxAgency
 * @param columnNames human-readable names for data category
 * @param period year, when data was published
 * @returns 
 */
const convertToRows = (obj: any, columnNames: {}, period: number) =>
  Object.entries(obj).reduce((acc, cur) => {
    if (cur[0].search(/current|revious/) === -1) return acc;
    const number = cur[0].match(/\d+/)?.[0];
    if (!number) return acc;
    if (acc[number]) {
      if (cur[0].startsWith('current')) {
        acc[number][period] = cur[1];
      } else if (cur[0].startsWith('previous')) {
        acc[number][period - 1] = cur[1];
      } else if (cur[0].startsWith('beforePrevious')) {
        acc[number][period - 2] = cur[1];
      }
    } else {
      const column = columnNames[number];
      if (!column || column === 'Баланс' || column === 'Итого по разделу')
        return acc;
      const item = {
        id: number,
        column,
      };
      if (cur[0].startsWith('current')) {
        item[period] = cur[1];
      } else if (cur[0].startsWith('previous')) {
        item[period - 1] = cur[1];
      } else if (cur[0].startsWith('beforePrevious')) {
        item[period - 2] = cur[1];
      }
      acc[number] = item;
    }
    return acc;
  }, {});

export const getColumnNames = async () => {
  log.info('parsing file');
  const html = await fs.readFile(path.join(__dirname, 'report2'), 'utf-8');
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

/**
 * gets data in this format (with optional fields possible):
    [
      {
        period: '2019',
        'balance': {
          "1230": {
            id: "1230",
            2017: 3565,
            2018: 567,
            2019: 7680,
            column: "Дебиторская задолженность"
          },
          ...
        },
        'financialResult': {...},
        'capitalChange': {...},
        'fundsMovement': {...},
      },
      {
        period: '2020',
        'balance': {
          "1230": {
            id: "1230",
            2018: 567,
            2019: 7680,
            2020: 2756,
            column: "Дебиторская задолженность"
          },
          ...
        },
        'financialResult': {...},
        'capitalChange': {...},
        'fundsMovement': {...},
      }]
  * and collects data for all years in one object
      "1230": {
        id: "1230",
        2017: 3565,
        2018: 567,
        2019: 7680,
        2020: 2756,
        column: "Дебиторская задолженность"
      }
 * @param details data objects by year (usually 2 different years)
 * @returns data with all years collected in every categry
 */
const flattenDetails = (details): IDetails => {
  const detailsCategories = [
    'balance',
    'financialResult',
    'capitalChange',
    'fundsMovement',
  ];
  //   sort peroids by year
  const sortedDetails = [...details].sort((a, b) => +a.period - +b.period);
  const flattenedDetails = { ...sortedDetails[0] };
  for (let i = 1; i < sortedDetails.length; i++) {
    detailsCategories.forEach((category) => {
      log.trace(`Flattening category ${category}`, flattenedDetails[category]);
      /**
       * Here we pick categories (like "1230") only from the first item.
       * This could lead to scenarios, where other items
       * could have not this category.
       *
       * For cases when category is missing
       * there is a guard with `continue`.
       * But even if we remove it, we'll generate error
       * when try to log some property of undefined
       * and stop current iteration of forEach cycle.
       *
       * Or they cold have additional categories.
       * We just skip these categories (could possibly be improved)
       */
      for (let id in flattenedDetails[category]) {
        if (!sortedDetails[i]?.[category]?.[id]) {
          log.debug(
            `Flattening id ${id}, not found`,
            sortedDetails[i]?.[category]?.[id]
          );
          continue;
        }
        log.trace(
          `Flattening id ${id}`,
          flattenedDetails[category][id],
          sortedDetails[i][category][id]
        );
        flattenedDetails[category][id] = joinObjects(
          flattenedDetails[category][id],
          sortedDetails[i][category][id]
        );
      }
      log.trace(`Flatten category ${category}`, flattenedDetails[category]);
    });
    flattenedDetails.period = sortedDetails[i].period;
    flattenedDetails.datePresent = sortedDetails[i].datePresent;
  }
  return flattenedDetails;
};

/**
 * Find closest resulst on result set by company name
 * @param result search result with content field (where actual results lie)
 * @param query search string (usually name of a service)
 * @returns search result with closest name
 */
export const findClosestResult = (
  result: ISearch,
  query: string | number
): IContent | null => {
  if (result.content.length === 0) return null;
  if (result.content.length === 1) return result.content[0];
  let closestContent = result.content[0],
    shortestDistance = Infinity;

  for (let content of result.content) {
    const distance = levenshtein(
      `<strong>${query}</strong>`,
      content.shortName
    );
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestContent = content;
      log.debug(
        `levenshtein distance : ${distance}, shortestDistance: ${shortestDistance}, closestId: ${closestContent.shortName}`
      );
    }
  }
  return closestContent;
};

/**
 * сервис получения бух отчетности
 */
export class BONalogService {
  /**
   * finds info by inn
   * @param query number
   * @return : Promise<IServiceResult>
   */
  static async getInfo(query: string): Promise<IServiceResult | null> {
    const info: IServiceResult = {
      inn: query,
      search: null,
      basicInfo: null,
      rowDetails: [],
      details: null,
    };
    try {
      let search = await request<ISearch>(
        `https://bo.nalog.ru/nbo/organizations/search?query=${encodeURI(
          query
        )}&page=0`
      );
      log.debug(`Found data by query ${query}`, search?.data);
      info.search = search.data;
      const content = findClosestResult(search.data, query);
      const id = content?.id;
      if (!id) {
        throw new Error(`Id for query ${query} not found!`);
      }

      const basicInfo = await request<IBasicInfo>(
        `https://bo.nalog.ru/nbo/organizations/${id}`
      );
      log.debug(`Found basicInfo by ID ${id}`, basicInfo?.data);
      if (!basicInfo) {
        throw new Error(`basicInfo for query ${query} not found!`);
      }
      info.basicInfo = basicInfo?.data;

      const bfo = await request<IBFO[]>(
        `https://bo.nalog.ru/nbo/organizations/${id}/bfo`
      );
      log.debug(`Found bfo by ID ${id}`, bfo?.data);
      if (!bfo) {
        throw new Error(`bfo for query ${query} not found!`);
      }
      const bfoIds: { id: number; period: string }[] = bfo.data.map((el) => ({
        id: el.id,
        period: el.period,
      }));
      log.debug(`Found bfo IDs:`, bfoIds);
      //   const columnNames = await getColumnNames();

      for (let bfoId of bfoIds) {
        const details: any = await request(
          `https://bo.nalog.ru/nbo/bfo/${bfoId.id}/details`
        );
        log.debug(
          `Found details by ID ${bfoId.id} and period ${bfoId.period}`,
          details?.data
        );
        if (!details?.data) continue;
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
            columnNames,
            +bfoId.period
          );
        });

        /*
         * // get addditional info
         * // ATTENTION! more refinig is needed

        const detailsId = details.data[0].id;
        const detailsCategories = [
          'balance',
          'financial_result',
          'capital_change',
          'funds_movement',
        ];
        const promises = detailsCategories.map(async (category) => {
          try {
            const categoryData = await axios(
              `https://bo.nalog.ru/nbo/details/${category}?id=${detailsId}`
            );
            logResult(
              `Found ${category} by ID ${detailsId}`,
              categoryData.data
            );
            return { category, data: categoryData.data };
          } catch (e) {
            log.error(`Error getting ${category}`, e);
            return null;
          }
        });
        //   log.debug('promises: ', promises);
        const resolved = await Promise.all(promises);
        console.log('resolved promises: ', resolved);
        resolved.forEach((el) => {
          if (el?.data) details.data[0][el.category] = el.data;
        });
         */

        log.trace(details.data[0]);
        info.rowDetails.push(details.data[0]);
      }
      const flattenedDetails = flattenDetails(info.rowDetails);
      info.details = flattenedDetails;
      info.inn = `${info.inn}`;
      log.debug(`Info by query ${query}\n'`, info);
      return info;
    } catch (e) {
      return info;
    }
  }
}
