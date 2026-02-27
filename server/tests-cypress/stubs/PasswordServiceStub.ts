import { PasswordService } from "../../src/infrastructure/auth/PasswordService";
import { AsyncMock } from "../utils/AsyncMock";

export class PasswordServiceStub extends PasswordService {
  readonly hashMock = new AsyncMock<[string], string>("hashed");
  readonly compareMock = new AsyncMock<[string, string], boolean>(true);

  async hash(password: string): Promise<string> {
    return this.hashMock.invoke(password);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return this.compareMock.invoke(password, hash);
  }
}
