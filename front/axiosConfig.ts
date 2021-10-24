import axios from 'axios';
export const CancelToken = axios.CancelToken;

export const api = axios.create({
  baseURL: `http://localhost/backend/`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status >= 200 && status < 500,
});

interface IData {
  id: string;
}

export interface IApiResponse {
  status: boolean;
  error: string | null;
  data: IData | null;
}
