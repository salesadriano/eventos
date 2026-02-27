import { ValidatePresentationUploadUseCase } from "../../../src/application/usecases/repository/ValidatePresentationUploadUseCase";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { expectAsyncError } from "../../utils/expectError";

export const validatePresentationUploadUseCaseSpecs = {
  validatesAllowedFileTypeAndSize(): void {
    const useCase = new ValidatePresentationUploadUseCase();

    useCase.execute({
      fileName: "presentation.pdf",
      mimeType: "application/pdf",
      sizeInBytes: 1024,
    });
  },

  async throwsWhenFileTypeIsNotAllowed(): Promise<void> {
    const useCase = new ValidatePresentationUploadUseCase();

    await expectAsyncError(
      async () => {
        useCase.execute({
          fileName: "script.sh",
          mimeType: "text/x-shellscript",
          sizeInBytes: 128,
        });
      },
      ValidationError
    );
  },
};
