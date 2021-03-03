# Maru.js

A minimal global state management library for React

## Installation

```bash
npm i --save marujs
```

or using yarn,

```bash
yarn add marujs
```

## useMaru

Usage

```typescript
const [state, setState] = useMaru(key, initialValue);
```

Example

```tsx
import { useMaru } from "marujs";

const CounterA = () => {
  const [count, setCount] = useMaru("count", 0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      A: {count}
    </button>
  );
};

const CounterB = () => {
  // Default value 0 won't be used if there already exists a state with same key "count"
  const [count, setCount] = useMaru("count", 0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      B: {count}
    </button>
  );
};

const CounterC = () => {
  /* 
    You can leave 'initialValue' field empty it was initialized by other component (Counter A).
    However, you should pass a type argument 'number' to get correct type of 'count' and 'setCount'
  */
  const [count, setCount] = useMaru<number>("count");
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      C: {count}
    </button>
  );
};
```
