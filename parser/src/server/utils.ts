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
