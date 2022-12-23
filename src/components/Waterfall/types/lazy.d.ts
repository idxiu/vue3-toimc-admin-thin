export interface LazyOptions {
  error?: string
  loading?: string
  observerOptions?: IntersectionObserverInit
  log?: boolean
}

export interface CallbackParams {
  width?: number
  height?: number
}

export interface LoadedEmitParams extends CallbackParams {
  dom?: HTMLImageElement
  src?: string
}

export interface ValueFormatterObject {
  src: string
  error?: string
  loading?: string
}

export default class Lazy {
  lazyActive: boolean
  options: LazyOptions

  _images = new WeakMap()

  constructor(flag = true, options: LazyOptions)

  config(options = {}): void

  // mount
  mount(
    el: HTMLImageElement,
    binding: string | ValueFormatterObject,
    callback: (params?: CallbackParams) => void
  ): void

  // update
  // update(el, binding, callback) {
  //   const imgItem = this._realObserver(el);
  //   imgItem && imgItem.unobserve(el);
  //   const { src, error } = this._valueFormatter(binding);
  //   this._initIntersectionObserver(el, src, error, callback);
  // }

  // refreshBox(el: HTMLImageElement): void

  // unmount
  unmount(el: HTMLElement): void

  resize(el: HTMLElement, callback: (params?: CallbackParams) => void): void

  /**
   * 设置img的src
   * @param {*} el - img
   * @param {*} src - 原图
   * @param {*} error - 错误图片
   * @param {*} callback - 完成的回调函数，通知组件刷新布局
   * @returns
   */
  _setImageSrc(
    el: HTMLImageElement,
    src: string,
    callback: (params?: CallbackParams) => void,
    error?: string
  ): void

  _isOpenLazy(): boolean

  /**
   * 添加img和对应的observer到weakMap中
   * 开启监听
   * 当出现在可视区域后取消监听
   * @param {*} el - img
   * @param {*} src - 图片
   * @param {*} error - 错误图片
   * @param {*} callback - 完成的回调函数，通知组件刷新布局
   */
  _initIntersectionObserver(
    el: HTMLImageElement,
    src: string,
    callback: () => void,
    error?: string
  ): void

  // 格式化参数
  _valueFormatter(value: ValueFormatterObject | string): ValueFormatterObject

  // 日志
  _log(callback: () => void): void

  // 在map中获取对应img的observer事件
  _realObserver(el: HTMLElement): IntersectionObserver | undefined
}
