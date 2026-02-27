import { ValidationError } from "../../../domain/errors/ApplicationError";

export interface ValidatePresentationUploadPayload {
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
}

export class ValidatePresentationUploadUseCase {
  private readonly maxSizeInBytes = 20 * 1024 * 1024;
  private readonly allowedMimeTypes = new Set([
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ]);

  execute(payload: ValidatePresentationUploadPayload): void {
    if (!payload.fileName.trim()) {
      throw new ValidationError("File name is required");
    }

    if (!this.allowedMimeTypes.has(payload.mimeType)) {
      throw new ValidationError("File type is not allowed");
    }

    if (payload.sizeInBytes <= 0 || payload.sizeInBytes > this.maxSizeInBytes) {
      throw new ValidationError("File size exceeds allowed limit");
    }
  }
}
