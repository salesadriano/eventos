import { UserEntity } from "../../../domain/entities/UserEntity";
import type { UserProfile } from "../../../domain/entities/UserEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { PasswordService } from "../../../infrastructure/auth/PasswordService";

export interface CreateUserPayload {
  id?: string;
  name: string;
  email: string;
  password?: string;
  profile?: UserProfile;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(payload: CreateUserPayload): Promise<UserEntity> {
    let hashedPassword: string | undefined;

    if (payload.password) {
      hashedPassword = await this.passwordService.hash(payload.password);
    }

    const user = new UserEntity({
      ...payload,
      password: hashedPassword,
    });

    if (user.id) {
      const existing = await this.userRepository.findById(user.id);
      if (existing) {
        throw new ValidationError(`User with id ${user.id} already exists`);
      }
    }

    const existingByEmail = await this.userRepository.findByEmail(user.email);
    if (existingByEmail) {
      throw new ValidationError(`User with email ${user.email} already exists`);
    }

    return this.userRepository.create(user);
  }
}
