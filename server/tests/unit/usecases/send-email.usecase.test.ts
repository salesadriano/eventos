import { SendEmailUseCase } from "../../../src/application/usecases/email/SendEmailUseCase";
import type { IMailClient } from "../../../src/domain/repositories/IMailClient";

describe("SendEmailUseCase", () => {
  it("sends validated email through mail client", async () => {
    const send = jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined);
    const mailClient: IMailClient = { send: send as IMailClient["send"] };
    const useCase = new SendEmailUseCase(mailClient);

    await useCase.execute({
      to: "recipient@example.com",
      subject: "Hello",
      text: "Body",
    });

    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({
      to: "recipient@example.com",
      subject: "Hello",
      text: "Body",
    });
  });

  it("throws when payload is invalid", async () => {
    const send = jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined);
    const mailClient: IMailClient = { send: send as IMailClient["send"] };
    const useCase = new SendEmailUseCase(mailClient);

    await expect(
      useCase.execute({
        to: "invalid-email",
        subject: "Hello",
        text: "Body",
      }),
    ).rejects.toThrow("Invalid email address");

    expect(send).not.toHaveBeenCalled();
  });
});