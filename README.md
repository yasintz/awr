# Awr

State management for react

```jsx
import { awr, useAwr } from 'awr';

const counter = awr(0);
const computedValue = awr(counter, n => `value: ${n}`);

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
      {/* hook tan gelen setValue fonksiyonunu kullanabilirsin. */}
      <button onClick={() => setValue(prev => prev + 1)}>Increment</button>

      {/* ayrica awr instance da calisacaktir.  */}
      <button onClick={() => counter.setValue(prev => prev - 1)}>
        Decrement
      </button>
    </div>
  );
};
```


[Demo App](https://codesandbox.io/s/cool-williamson-cbfjd?file=/src/App.js)
![output](https://user-images.githubusercontent.com/36041339/95005230-3a20eb00-05fe-11eb-8d82-d8e380f96c34.gif)

