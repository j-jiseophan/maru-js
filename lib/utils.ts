export const isServerSide = (): boolean => {
  return typeof window === "undefined";
};

export const generateId = (): string =>
  Math.floor(Math.random() * 1000000000000).toString();
