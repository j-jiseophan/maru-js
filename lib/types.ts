type Trigger = () => void;
export interface Store {
  [key: string]: Maru;
}

export interface Maru<T = any> {
  value: T;
  triggers: {
    [id: string]: Trigger;
  };
}

export interface InitialData<T = any> {
  [key: string]: T;
}

export type UseMaruReturn<T> = [T, (value: T) => void];

export type MaruUpdater<T> = () => Promise<T>;
