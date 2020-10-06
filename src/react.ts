import * as React from 'react';
import awr from './core';
import { AWR, AWRNode, ComputedAWR } from './helpers';

function useAwr<
  T,
  A extends AWRNode<T> = AWR<T> | ComputedAWR<T>,
  B extends boolean = A['computed']
>(awr: A): B extends false ? [T, AWR<T>['setValue']] : T {
  const _awr = React.useRef(awr);
  _awr.current = awr;
  const [value, setValue] = React.useState(awr.value);

  React.useEffect(
    () => _awr.current.subscribe(newValue => setValue(newValue)),
    []
  );

  const awrSetValue = (awr as any).setValue;
  if (typeof awrSetValue === 'undefined') {
    return value as any;
  } else {
    return [value, awrSetValue] as any;
  }
}

const node = awr<string>();
const cnode = awr(node, v => `Yasin ${v}`);
const b = useAwr(node);
const c = useAwr(cnode);

export default useAwr;
