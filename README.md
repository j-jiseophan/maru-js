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
const [state, setState] = useMaru(key, defaultValue);
```

Example

```tsx
const CounterA = () => {
  const [count, setCount] = useMaru("count", 0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      A: {count}
    </button>
  );
};

const CounterB = () => {
  const [count, setCount] = useMaru("count", 0); // default value 0 won't be used if there already exists a state with same key "count"
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      B: {count}
    </button>
  );
};
```
