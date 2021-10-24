import axios from 'axios';
export const CancelToken = axios.CancelToken;

export const api = axios.create({
  baseURL: `http://localhost/backend/`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status >= 200 && status < 500,
});

export interface IData {
  id?: string;
  funds?: string[];
  accelerators?: string[];
  progressInstitute?: string[];
}

export interface IApiResponse<T = IData> {
  status: boolean;
  error: string | null;
  data: T | null;
}
