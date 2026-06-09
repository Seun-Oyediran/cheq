import axios from 'axios';
import type { AxiosResponse } from 'axios';

interface Request {
  url: string;
  headers?: Record<string, string>;
}

const get = async ({ url, headers }: Request): Promise<AxiosResponse<any, any, unknown>> => {
  return await axios.get(url, { headers });
};

export const api = {
  get,
};
