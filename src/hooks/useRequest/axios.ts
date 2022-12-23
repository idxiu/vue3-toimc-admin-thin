import axios, { AxiosRequestConfig, Canceler } from 'axios';
import { RequestResponse } from './types';

const instance = axios.create({
  baseURL: '/api',
  timeout: 30 * 1000
})

export function request<T>(config: AxiosRequestConfig): RequestResponse<T> {
  const cancel = ref<Canceler>();
  return {
    instance: instance({
      ...config,
      cancelToken: new axios.CancelToken((c) => {
        cancel.value = c;
      })
    }),
    cancel
  };
}