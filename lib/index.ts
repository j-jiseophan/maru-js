import { useCallback, useEffect, useState } from "react";

type Trigger = () => void;

interface Store {
  [key: string]: Maru;
}

interface Maru<T = any> {
  value: T;
  triggers: {
    [id: string]: Trigger;
  };
}

const store: Store = {};

export const useMaru = <T>(key: string, defaultValue: T) => {
  const [id] = useState(Math.floor(Math.random() * 100000000000).toString());
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    if (shouldUpdate) {
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  useEffect(() => {
    return () => {
      delete store[key].triggers[id];
    };
  }, [key, id]);

  if (!store[key]) {
    store[key] = { value: defaultValue, triggers: {} };
  }
  const maru = store[key] as Maru<T>;

  if (!maru.triggers[id]) {
    maru.triggers[id] = () => {
      setShouldUpdate(true);
    };
  }

  const setMaruState = useCallback(
    (value: T) => {
      maru.value = value;
      const { triggers } = maru;
      Object.keys(triggers).forEach((triggerId) => triggers[triggerId]());
    },
    [maru]
  );

  return [maru.value, setMaruState];
};
