/* eslint-disable */
import * as React from 'react';

type Callback<T> = (val: T) => void;

type StateAction<S> = (v: S) => void | ((v: (prev: S) => S) => void);

export type AWR<T> = {
  value: T;
  setValue: StateAction<T>;
  subscribe: (callback: Callback<T>) => () => void;
  unsubscribe: (callback: Callback<T>) => void;
};

export type ComputedAWR<T> = Omit<AWR<T>, 'setValue'>;

const isFn = (f: any) => typeof f === 'function';

function isAwrObject(o: any) {
  return isFn(o.setValue) && isFn(o.subscribe) && isFn(o.unsubscribe);
}

function awr<T, R = T>(v: AWR<T>, cb: (v: T) => R): ComputedAWR<T>;

function awr<T>(v: T): AWR<T>;

function awr<T>(value: any, cb?: any): AWR<T> | ComputedAWR<T> {
  if (isAwrObject(value) && cb) {
    return computed(value, cb);
  }

  const obj = {
    value,
  };

  let subscribers: Callback<any>[] = [];

  const setValue: AWR<T>['setValue'] = newValue => {
    const _newValue =
      typeof newValue === 'function' ? newValue(obj.value) : newValue;

    subscribers.forEach(subscriber => subscriber(_newValue));

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

function computed<T, R = T>(r: AWR<T>, c: (v: T) => R): ComputedAWR<R> {
  const state = awr(c(r.value));

  r.subscribe(newVal => state.setValue(c(newVal)));

  return {
    value: state.value,
    subscribe: state.subscribe,
    unsubscribe: state.unsubscribe,
  };
}

function useAwr<T>(awr: AWR<T>) {
  const _awr = React.useRef(awr);
  _awr.current = awr;
  const [value, setValue] = React.useState(awr.value);

  React.useEffect(
    () => _awr.current.subscribe(newValue => setValue(newValue)),
    []
  );

  return [value, awr.setValue] as const;
}

export { awr, useAwr };

export default useAwr;
