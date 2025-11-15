import { UserEntity } from "../../domain/entities/UserEntity";

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const UserDtoMapper = {
  toResponse(user: UserEntity): UserResponseDto {
    const primitives = user.toPrimitives();
    return {
      id: primitives.id,
      name: primitives.name,
      email: primitives.email,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt.toISOString(),
    };
  },
};
