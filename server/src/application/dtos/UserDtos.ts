import { UserEntity } from "../../domain/entities/UserEntity";
import type { UserProfile } from "../../domain/entities/UserEntity";

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
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
      profile: primitives.profile,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt.toISOString(),
    };
  },
};
