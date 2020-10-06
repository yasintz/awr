export type Callback<T> = (val: T) => void;

export type StateAction<S> = (v: S) => void | ((v: (prev: S) => S) => void);

export type AWRNode<T> = {
  value: T;
  subscribe: (callback: Callback<T>) => () => void;
  unsubscribe: (callback: Callback<T>) => void;
  computed: boolean;
};

export type AWR<T> = AWRNode<T> & {
  setValue: StateAction<T>;
  computed: false;
};

export type ComputedAWR<T> = AWRNode<T> & {
  computed: true;
};
