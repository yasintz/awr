# Awr

State management for react

```jsx
import awr from 'awr';

const counter = awr(0);
const computedValue = awr.computed(counter, val => Math.sqrt(val));

const CounterWriter = () => {
  const value = counter.useValue();
  return <h1>{value}</h1>;
};

const ComputedWriter = () => {
  const value = computedValue.useValue();
  return <h1 style={{ color: 'red' }}>computed {value}</h1>;
};

const App = () => {
  const [value, setValue] = counter.use();

  return (
    <div>
      <CounterWriter />
      <ComputedWriter />
      {/* You can use the setValue function from the hook. */}
      <button onClick={() => setValue(prev => prev + 1)}>Increment</button>

      {/* It will also run on awr instance. */}
      <button onClick={() => counter.setValue(prev => prev - 1)}>
        Decrement
      </button>
    </div>
  );
};
```

[Demo App](https://codesandbox.io/s/cool-williamson-cbfjd)
