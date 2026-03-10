export const expectAsyncError = async (
  fn: () => Promise<unknown>,
  ErrorType: new (...args: unknown[]) => Error,
): Promise<Error> => {
  try {
    await fn();
  } catch (error) {
    expect(error).toBeInstanceOf(ErrorType);
    return error as Error;
  }

  throw new Error(`Expected function to throw ${ErrorType.name}, but it resolved`);
};
