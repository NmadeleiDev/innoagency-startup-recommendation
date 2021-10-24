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
      for (let id in flattenedDetails[category]) {
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
  static async getInfo(query: string): Promise<IServiceResult> {
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
      log.debug(`Found data by query ${query}`, search.data);
      info.search = search.data;
      const content = findClosestResult(search.data, query);
      const id = content?.id;
      if (!id) {
        return log.warn(`Id for query ${query} not found!`);
      }

      const basicInfo = await request<IBasicInfo>(
        `https://bo.nalog.ru/nbo/organizations/${id}`
      );
      log.debug(`Found basicInfo by ID ${id}`, basicInfo.data);
      info.basicInfo = basicInfo.data;

      const bfo = await request<IBFO[]>(
        `https://bo.nalog.ru/nbo/organizations/${id}/bfo`
      );
      log.debug(`Found bfo by ID ${id}`, bfo.data);
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
        if (!details.data) continue;
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
      return log.error(e);
    }
  }
}