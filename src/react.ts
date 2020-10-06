import * as React from 'react';
import { AWR, AWRNode, ComputedAWR, StateAction } from './helpers';

function useAwr<T>(awr: AWR<T>): [T, StateAction<T>];
function useAwr<T>(awr: ComputedAWR<T>): T;

function useAwr<T>(awr: AWRNode<T> & { setValue?: StateAction<T> }) {
  const _awr = React.useRef(awr);
  _awr.current = awr;
  const [value, setValue] = React.useState(awr.value);

  React.useEffect(
    () => _awr.current.subscribe(newValue => setValue(newValue)),
    []
  );

  const awrSetValue = awr.setValue;

  if (typeof awrSetValue === 'undefined') {
    return value as any;
  } else {
    return [value, awrSetValue] as any;
  }
}

export default useAwr;
