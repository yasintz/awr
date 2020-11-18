import { AWR, Callback, AWRNode, ComputedAWR } from './helpers';

const isFn = (f: any) => typeof f === 'function';

function isAwrObject(o: any) {
  return (
    o !== null &&
    o !== undefined &&
    isFn(o.subscribe) &&
    isFn(o.unsubscribe) &&
    o.__awr
  );
}

function awr<T, R = T>(v: AWR<T>, cb: (v: T) => R): ComputedAWR<T>;

function awr<T>(v: T): AWR<T>;

function awr<T>(value: any, cb?: any): AWR<T> | AWRNode<T> {
  if (isAwrObject(value) && isFn(cb)) {
    return computed(value, cb);
  }

  const subscribers: Callback<any>[] = [];

  const store = {
    value,
  };

  const setValue: AWR<T>['setValue'] = newValue => {
    const _newValue =
      typeof newValue === 'function' ? newValue(store.value) : newValue;

    subscribers.forEach(subscriber => subscriber(_newValue));

    store.value = _newValue;
  };
  const unsubscribe = (callback: Callback<any>) => {
    for (var i = 0; i < subscribers.length; i++) {
      if (subscribers[i] === callback) {
        subscribers.splice(i, 1);
        break;
      }
    }
  };

  const subscribe = (callback: Callback<any>) => {
    subscribers.push(callback);
    return () => unsubscribe(callback);
  };

  return Object.assign(store, {
    setValue,
    subscribe,
    unsubscribe,
    computed: false,
    __awr: true,
  });
}

function computed<T, R = T>(baseState: AWR<T>, c: (v: T) => R): ComputedAWR<R> {
  const state = awr(c(baseState.value));

  baseState.subscribe(newVal => state.setValue(c(newVal)));

  const result: ComputedAWR<R> = {
    computed: true,
    value: state.value,
    subscribe: state.subscribe,
    unsubscribe: state.unsubscribe,
  };

  return {
    __awr: true,
    ...result,
  } as any;
}

export default awr;
