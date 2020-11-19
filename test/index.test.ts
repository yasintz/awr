import awr from '../src/index';

describe('Computed value has the correct value', () => {
  it('factorial', () => {
    // https://stackoverflow.com/a/3959275/10039122
    function factorial(num: number) {
      let result = num;
      if (num === 0 || num === 1) return 1;
      while (num > 1) {
        num--;
        result *= num;
      }
      return result;
    }
    const countState = awr(0);
    const factorialState = awr.computed(countState, factorial);

    expect(countState.get()).toEqual(0);
    expect(factorialState.get()).toEqual(1);

    countState.set(1);
    expect(countState.get()).toEqual(1);
    expect(factorialState.get()).toEqual(1);

    countState.set(2);
    expect(countState.get()).toEqual(2);
    expect(factorialState.get()).toEqual(2);

    countState.set(3);
    expect(countState.get()).toEqual(3);
    expect(factorialState.get()).toEqual(6);

    countState.set(3);
    expect(countState.get()).toEqual(3);
    expect(factorialState.get()).toEqual(6);

    countState.set(5);
    expect(countState.get()).toEqual(5);
    expect(factorialState.get()).toEqual(120);

    countState.set(10);
    expect(countState.get()).toEqual(10);
    expect(factorialState.get()).toEqual(3628800);
  });

  it('object', () => {
    const baseState = awr({
      name: 'john',
      age: 20,
    });

    const nameState = awr.computed(baseState, state => state.name);

    expect(baseState.get().name).toEqual('john');
    expect(nameState.get()).toEqual('john');

    baseState.set(prev => ({ ...prev, name: 'mike' }));

    expect(baseState.get().name).toEqual('mike');
    expect(nameState.get()).toEqual('mike');
  });

  it('array', () => {
    function last<T>(arr: T[]): T {
      return arr[arr.length - 1];
    }

    function first<T>(arr: T[]): T {
      return arr[0];
    }
    const baseState = awr([1, 2, 3, 4]);

    const lastNumberState = awr.computed(baseState, last);
    const firstNumberState = awr.computed(baseState, first);

    expect(last(baseState.get())).toEqual(4);
    expect(lastNumberState.get()).toEqual(4);

    expect(first(baseState.get())).toEqual(1);
    expect(firstNumberState.get()).toEqual(1);

    baseState.set(prev => [...prev, 5]);

    expect(last(baseState.get())).toEqual(5);
    expect(lastNumberState.get()).toEqual(5);

    expect(first(baseState.get())).toEqual(1);
    expect(firstNumberState.get()).toEqual(1);
  });
});
