import type { NextFunction, Request, Response } from "express";
import type { Email } from "../../../domain/entities/Email";
import type { SendEmailUseCase } from "../../../application/usecases/email/SendEmailUseCase";

interface EmailControllerDependencies {
  sendEmailUseCase: SendEmailUseCase;
}

export class EmailController {
  constructor(private readonly deps: EmailControllerDependencies) {}

  send = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const emailData = req.body as Email;
      await this.deps.sendEmailUseCase.execute(emailData);
      // RESTful: 201 Created for resource creation
      res.status(201).json({
        success: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

