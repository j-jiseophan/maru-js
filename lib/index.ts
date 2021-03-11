import { DependencyList, useCallback, useEffect, useState } from "react";

import { Store, InitialData, UseMaruReturn, Maru, MaruUpdater } from "./types";
import { isServerSide } from "./utils";

const store: Store = {};

let initialized = false;

export const useMaruInit = (initialData: InitialData): void => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (mount) {
      return;
    }
    if (initialized) {
      throw "You called 'useMaruInit' more than once.";
    }
    initialized = true;
    setMount(true);
  }, [mount]);

  if (!mount) {
    if (isServerSide()) {
      return;
    }
    Object.keys(initialData).forEach((key) => {
      store[key] = { value: initialData[key], triggers: {} };
      return;
    });
  }
};

export const useMaru = <T>(key: string): UseMaruReturn<T> => {
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

  const maru = store[key] as Maru<T>;

  const setMaruState = useCallback(
    (value: T) => {
      maru.value = value;
      const { triggers } = maru;
      setTimeout(() => {
        Object.keys(triggers).forEach((triggerId) => triggers[triggerId]());
      }, 0);
    },
    [maru]
  );

  if (isServerSide()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore for serverside
    return [undefined, undefined];
  }
  if (!store[key]) {
    throw `The state for key '${key}' has not been initialized.`;
  }

  if (!maru.triggers[id]) {
    maru.triggers[id] = () => {
      setShouldUpdate(true);
    };
  }
  return [maru.value, setMaruState];
};

export const useMaruUpdater = <T>(
  key: string,
  updater: MaruUpdater<T>,
  dependencies: DependencyList
): void => {
  const maru = store[key] as Maru<T>;
  if (maru === undefined) {
    throw `The state for key '${key}' has not been initialized.`;
  }
  useEffect(() => {
    (async () => {
      const data = await updater();
      maru.value = data;
      const { triggers } = maru;
      setTimeout(() => {
        Object.keys(triggers).forEach((triggerId) => triggers[triggerId]());
      }, 0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

// for testing purpose
export const clearStore = (): void => {
  Object.keys(store).forEach((key) => delete store[key]);
  initialized = false;
};
