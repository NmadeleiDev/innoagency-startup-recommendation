import log from '../logger/logger';

export interface IResponse {
  status: boolean;
  data: any;
}

export function createSuccessResponse(data: any): IResponse {
  return {
    status: true,
    data: data,
  };
}

export function createErrorResponse(data: any): IResponse {
  return {
    status: false,
    data: data,
  };
}

export const joinObjects = (a, b) => {
  if (!b) return a;
  const newA = { ...a };
  Object.entries(b).forEach(([k, v]) => {
    newA[k] = v;
  });
  return newA;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isFullfilledPromiseResult = <T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> => {
  return result.status === 'fulfilled';
};
