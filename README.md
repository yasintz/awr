# Awr

State management for react

```jsx
import { awr, useAwr } from 'awr';

const counter = awr(0);
const computedValue = awr(counter, val => Math.sqrt(val));

const CounterWriter = () => {
  const [value] = useAwr(counter);
  return <h1>{value}</h1>;
};

const ComputedWriter = () => {
  const [value] = useAwr(computedValue);
  return <h1 style={{ color: 'red' }}>computed {value}</h1>;
};

const App = () => {
  const [value, setValue] = useAwr(counter);

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

[Demo App](https://codesandbox.io/s/cool-williamson-cbfjd?file=/src/App.js)
