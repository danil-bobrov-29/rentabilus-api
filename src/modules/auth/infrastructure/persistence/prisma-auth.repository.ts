import { AuthUser, UserRole } from '@auth/domain/auth-user';
import { EmailAlreadyExistsError } from '@auth/domain/auth.errors';
import { AuthRepository, CreateAuthUser } from '@auth/domain/auth.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { credential: true },
    });

    if (!user?.credential) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.credential.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      position: user.position,
      role: user.role,
    };
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { credential: true },
    });

    if (!user?.credential) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.credential.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      position: user.position,
      role: user.role,
    };
  }

  async create(input: CreateAuthUser): Promise<AuthUser> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          middleName: input.middleName,
          role: UserRole.USER,
          credential: {
            create: {
              passwordHash: input.passwordHash,
            },
          },
        },
        include: {
          credential: true,
        },
      });

      return {
        id: user.id,
        email: user.email,
        passwordHash: user.credential!.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        position: user.position,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }
}
