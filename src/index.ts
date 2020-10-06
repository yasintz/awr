/* eslint-disable */
import * as React from 'react';

type Callback<T> = (oldVal: T, newVal: T) => void;

type StateAction<S> = (v: S) => void | ((v: (prev: S) => S) => void);
export type AWRResponse<T> = {
  value: T;
  setValue: StateAction<T>;
  subscribe: (callback: Callback<T>) => () => void;
  unsubscribe: (callback: Callback<T>) => void;
};

const isFn = (f: any) => typeof f === 'function';

function isAwrObject(o: any) {
  return isFn(o.setValue) && isFn(o.subscribe) && isFn(o.unsubscribe);
}

function awr<T, R = T>(v: AWRResponse<T>, cb: (v: T) => R): AWRResponse<T>;
function awr<T>(v: T): AWRResponse<T>;

function awr<T>(value: any, cb?: any): AWRResponse<T> {
  if (isAwrObject(value) && cb) {
    return computed(value, cb);
  }

  const obj = {
    value,
  };

  let subscribers: Callback<any>[] = [];

  const setValue: AWRResponse<T>['setValue'] = newValue => {
    const _newValue =
      typeof newValue === 'function' ? newValue(obj.value) : newValue;

    subscribers.forEach(subscriber => {
      subscriber(obj.value, _newValue);
    });

    obj.value = _newValue;
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

  return Object.assign(obj, { setValue, subscribe, unsubscribe });
}

function computed<T, R = T>(r: AWRResponse<T>, c: (v: T) => R): AWRResponse<R> {
  const _computedAWR = awr(c(r.value));

  r.subscribe((oldVal, newVal) => {
    _computedAWR.setValue(c(newVal));
  });

  return _computedAWR;
}

function useAwr<T>(awr: AWRResponse<T>) {
  const _awr = React.useRef(awr);
  _awr.current = awr;
  const [value, setValue] = React.useState(awr.value);

  React.useEffect(
    () => _awr.current.subscribe((old, newValue) => setValue(newValue)),
    []
  );

  return [value, awr.setValue] as const;
}

export { awr, useAwr };

export default useAwr;
