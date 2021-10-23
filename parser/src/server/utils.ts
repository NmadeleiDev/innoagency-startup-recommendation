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

export const logResult = (request: string, response: Object) => {
  log.debug(request);
  log.debug(response);
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
