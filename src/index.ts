import * as React from 'react';
type Dispatch<T> = (val: T) => void;

type SetStateAction<S> = Dispatch<S | ((prevState: S) => S)>;

type UseHookResponse<T> = [T, SetStateAction<T>];

export type ComputedAwr<T> = {
  get: () => T;
  subscribe: (callback: Dispatch<T>) => () => void;
  unsubscribe: (callback: Dispatch<T>) => void;
  useValue: () => T;
  useSelector: <V>(cb: (v: T) => V) => V;
};

export type Awr<T> = ComputedAwr<T> & {
  set: SetStateAction<T>;
  use: () => UseHookResponse<T>;
};

function useValue<T>(awr: Pick<Awr<T>, 'get' | 'subscribe'>) {
  const _awr = React.useRef(awr);
  _awr.current = awr;
  const [value, setValue] = React.useState(awr.get());

  React.useEffect(
    () => _awr.current.subscribe(newValue => setValue(newValue)),
    []
  );

  return value;
}

function use<T>(awr: Pick<Awr<T>, 'get' | 'subscribe' | 'set'>) {
  const value = useValue(awr);

  return [value, awr.set] as UseHookResponse<T>;
}

function useSelector<T, V>(
  awr: Pick<Awr<T>, 'get' | 'subscribe'>,
  cb: (t: T) => V
): V {
  const value = useValue(awr);

  return cb(value);
}

function _awr<T>(_value: T): Awr<T> {
  const subscribers: Dispatch<any>[] = [];
  let value = _value;

  const set: Awr<T>['set'] = (newValue: any) => {
    const _newValue =
      typeof newValue === 'function' ? newValue(value) : newValue;

    value = _newValue;

    subscribers.forEach(subscriber => subscriber(_newValue));
  };
  const unsubscribe = (callback: Dispatch<any>) => {
    for (var i = 0; i < subscribers.length; i++) {
      if (subscribers[i] === callback) {
        subscribers.splice(i, 1);
        break;
      }
    }
  };

  const subscribe = (callback: Dispatch<any>) => {
    subscribers.push(callback);
    return () => unsubscribe(callback);
  };
  const get = () => value;

  return {
    get,
    subscribe,
    unsubscribe,
    useValue: () => useValue({ get, subscribe }),
    set,
    use: () => use({ get, set, subscribe }),
    useSelector: cb => useSelector({ get, subscribe }, cb),
  };
}

function _computed<T, R = T>(
  baseState: Awr<T>,
  c: (v: T) => R
): ComputedAwr<R> {
  const state = _awr(c(baseState.get()));

  baseState.subscribe(newVal => state.set(c(newVal)));

  return {
    get: state.get,
    subscribe: state.subscribe,
    unsubscribe: state.unsubscribe,
    useSelector: state.useSelector,
    useValue: state.useValue,
  };
}

type ComputedFunction = typeof _computed;

type AwrFunction = typeof _awr & {
  computed: ComputedFunction;
};

_awr.computed = _computed;

const awr: AwrFunction = _awr;

export default awr;
