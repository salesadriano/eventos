export interface IGoogleSheetsClient {
  read(range: string): Promise<string[][]>;
  write(range: string, values: string[][]): Promise<void>;
  append(values: string[][]): Promise<void>;
  update(range: string, values: string[][]): Promise<void>;
  delete(range: string): Promise<void>;
}
