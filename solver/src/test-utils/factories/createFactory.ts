export const createFactory =
  <T>(base: T) =>
  (overrides: Partial<T> = {}) => ({
    ...base,
    ...overrides,
  });
