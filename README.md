# Maru.js

[![npm version](https://badge.fury.io/js/maru-js.svg)](https://badge.fury.io/js/maru-js)

A minimal state management library for React

## Features

- global state management with few codes.
- easily fetch data and sync to state
- ESLint supported with [eslint-plugin-maru](https://github.com/jshan2017/eslint-plugin-maru)

## Installation

```bash
npm i --save maru-js
```

or using yarn,

```bash
yarn add maru-js
```

## useMaruInit - initialize states from root component
```
useMaruInit({key: value})
```
```typescript
// App.tsx

import { useMaruInit } from "maru-js";

const App = () => {
  useMaruInit({ count: 0, inputValue: "" });

  return (
    <div>
      <CounterA />
      <CounterB />
      <Input />
    </div>
  );
};
```

## useMaru - use state globally
```
[state, setState] = useMaru<T>(key: string)
```

```tsx
import { useMaru } from "maru-js";

const CounterA = () => {
  const [count, setCount] = useMaru("count");
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      A: {count}
    </button>
  );
};

const Input = () => {
  // pass type parameter 'number' to get correct type for the return value.
  const [inputValue, setInputValue] = useMaru<string>("inputValue");
  return (
    <input
      type="text"
      value={inputValue}
      onChange={({ target }) => setInputValue(target.value)}
    />
  );
};
```

## useMaruUpdater - easily fetch data and update state
```
useMaruUpdater(key: string, updater: () => Promise<T>, dependencies: any[])
```

```tsx
import { useMaru, useMaruUpdater } from "maru-js";

// define async fetcher function
const fetcher = async (id: number) => {
  const res = await fetch(`https://maru-api-test.com/count/${id}`);
  const { count } = await res.json();
  return count;
};

const CounterA = () => {
  const [id, setId] = useMaru("id");
  const [count, setCount] = useMaru("count");
  // updater is re-called if dependency changes
  useMaruUpdater("count", () => fetcher(id), [id]);

  return (
    <button type="button" onClick={() => setId(id + 1)}>
      A: {count}
    </button>
  );
};
```
