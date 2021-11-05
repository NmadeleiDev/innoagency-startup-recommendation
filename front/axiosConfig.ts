import axios from 'axios';
export const CancelToken = axios.CancelToken;
const host =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BACKEND_HOSTNAME
    : 'localhost';
const protocol =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROTOCOL
    : 'http';
const baseURL = `${protocol}://${host}/backend/`;
console.log(baseURL);
export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status >= 200 && status < 500,
});

export interface IRecomendation {
  id: string;
  name: string;
  type: string;
  score: number;
  metrics: (number | JSX.Element)[];
}
export interface IData {
  id?: string;
  reco: IRecomendation[];
  metrics: string[];
}

export interface IApiResponse<T = IData> {
  status: boolean;
  error: string | null;
  data: T | null;
}
