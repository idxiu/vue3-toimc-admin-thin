import { debounce, throttle, isFunction } from 'lodash-es';
import { Options, Service, IRequestResult, ErrorData } from './types';

const defaultQuerise = Symbol('default');

export function useRequest<T, P extends any[]>(
  service: Service<T, P>,
  options: Options<T, P> = {}
) {
  const {
    manual = false,
    defaultParams = ([] as unknown as P),
    repeatCancel = false,
    refreshDeps = null,
    refreshDepsParams = null,
    debounceWait,
    debounceLeading,
    debounceTrailing,
    throttleWait,
    throttleLeading,
    throttleTrailing,
    queryKey = null
  } = options;

  const querise = reactive<Record<string | symbol, IRequestResult<T>>>({
    [defaultQuerise]: {
      data: null,
      loading: false,
      cancel: () => null,
      err: undefined
    }
  });

  const serviceFn = async (...args: P) => {
    const key = queryKey ? queryKey(...args) : defaultQuerise;
    if(!querise[key]) {
      querise[key] = {} as any;
    }
    if(!queryKey && repeatCancel) {
      querise[key].cancel();
    }
    querise[key].loading = true;
    const { instance, cancel } = service(...args);
    querise[key].cancel = cancel as any;
    instance
      .then((res) => {
        querise[key].data = res.data.data;
        querise[key].err = undefined;
        if(isFunction(options.onSuccess)) {
          options.onSuccess(res, args);
        }
      })
      .catch((err: ErrorData) => {
        querise[key].err = err;
        if(isFunction(options.onError)) {
          options.onError(err, args);
        }
      })
      .finally(() => {
        querise[key].loading = false;
      })
  }

  let run = serviceFn;

  if(throttleWait) {
    run = throttle(serviceFn, throttleWait, {
      leading: throttleLeading || true,
      trailing: throttleTrailing || true
    }) as any;
  }

  if(debounceWait) {
    run = debounce(serviceFn, debounceWait, {
      leading: debounceLeading || true,
      trailing: debounceTrailing || true
    })
  }

  if(refreshDeps) {
    watch(refreshDeps, () => {
      run(...(refreshDepsParams?.value || ([] as unknown as P)));
    }, { deep: true });
  }

  
  if(!manual) {
    run(...defaultParams);
  }

  return {
    run,
    querise,
    ...toRefs(querise[defaultQuerise])
  }
}
