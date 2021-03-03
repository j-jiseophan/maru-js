declare type UseMaruReturn<T> = [T, (value: T) => void];
export declare const useMaru: <T>(key: string, initialValue?: T | undefined) => UseMaruReturn<T>;
export {};
