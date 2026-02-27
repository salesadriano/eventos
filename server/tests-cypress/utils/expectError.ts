import { expect } from "chai";

export const expectAsyncError = async (
  fn: () => Promise<unknown>,
  errorType: new (...args: unknown[]) => Error,
): Promise<void> => {
  let error: unknown;
  try {
    await fn();
  } catch (err) {
    error = err;
  }

  expect(error).to.be.instanceOf(errorType);
};
