export class AsyncMock<TArgs extends unknown[], TResult> {
  private handler: (...args: TArgs) => Promise<TResult>;
  private errorFactory: (() => Promise<TResult>) | null = null;
  public readonly calls: TArgs[] = [];

  constructor(defaultValue?: TResult) {
    this.handler = async () => defaultValue as TResult;
  }

  async invoke(...args: TArgs): Promise<TResult> {
    this.calls.push(args);
    if (this.errorFactory) {
      return this.errorFactory();
    }
    return this.handler(...args);
  }

  resolveWith(value: TResult): void {
    this.errorFactory = null;
    this.handler = async () => value;
  }

  implement(fn: (...args: TArgs) => Promise<TResult>): void {
    this.errorFactory = null;
    this.handler = fn;
  }

  rejectWith(error: unknown): void {
    this.errorFactory = async () => {
      throw error instanceof Error ? error : new Error(String(error));
    };
  }

  get callCount(): number {
    return this.calls.length;
  }
}
