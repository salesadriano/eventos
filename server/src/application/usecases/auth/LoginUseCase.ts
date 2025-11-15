import { ValidationError } from "../../../domain/errors/ApplicationError";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { PasswordService } from "../../../infrastructure/auth/PasswordService";
import type { LoginRequest, LoginResponse } from "../../dtos/AuthDtos";
import { UserDtoMapper } from "../../dtos/UserDtos";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    if (!user.password) {
      throw new ValidationError("User has no password set");
    }

    const isPasswordValid = await this.passwordService.compare(
      request.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ValidationError("Invalid email or password");
    }

    const tokenPair = this.jwtService.generateTokenPair({
      userId: user.id,
      email: user.email,
      profile: user.profile,
    });

    const userDto = UserDtoMapper.toResponse(user);

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: userDto.id,
        name: userDto.name,
        email: userDto.email,
        profile: userDto.profile,
      },
    };
  }
}

