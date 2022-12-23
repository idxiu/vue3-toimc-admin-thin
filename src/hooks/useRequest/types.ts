import { AxiosResponse, Canceler } from 'axios'
import { ComputedRef, Ref, WatchSource } from 'vue'

export interface Response<T> {
  status: number
  data: T
  msg: string
}

export type AppAxiosResponse<T> = AxiosResponse<Response<T>>

export interface RequestResponse<T> {
  instance: Promise<AppAxiosResponse<T>>
  cancel: Ref<Canceler | undefined>
}

export type Service<T, P extends any[]> = (...args: P) => RequestResponse<T>

export interface Options<T, P extends any[]> {
  // 是否启用 默认false - 不加入防抖节流
  manual?: boolean
  // 默认参数
  defaultParams?: P

  // 关闭重复请求
  repeatCancel?: boolean;
  // 依赖更新
  refreshDeps?: WatchSource<any>[];
  // 依赖更新时的参数
  refreshDepsParams?: ComputedRef<P>;
  
  // 防抖时间
  debounceWait?: number
  // leading  防抖部分 决定延迟前后如何触发, true-先调用后等待
  debounceLeading?: boolean
  // trailing 防抖部分 决定延迟前后如何触发, true-先等待后调用
  debounceTrailing?: boolean

  // 节流时间
  throttleWait?: number
  // 同上 文档：https://www.lodashjs.com/docs/lodash.debounce
  throttleLeading?: boolean
  throttleTrailing?: boolean

  queryKey?: (...args: P) => string

  // 成功回调
  onSuccess?: (response: AxiosResponse<Response<T>>, params: P) => void;

  // 失败回调
  onError?: (err: ErrorData, params: P) => void;
}

export interface IRequestResult<T> {
  data: T | null;
  loading: boolean;
  cancel: Canceler;
  err?: ErrorData;
}

export interface ErrorData<T = any> {
  code: number | string;
  data: T;
  msg: string;
}
