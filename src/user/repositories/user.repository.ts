import { PrismaService } from "../../prisma/prisma.service";
import { User } from "../entities/user.entity";
import { UserMapper } from "../mapper/UserMapper";
import { Injectable } from "@nestjs/common";

export interface IUserRepo {
  findUserByEmail(email: string): Promise<User | null>;
  findUserByEmailWithRelations(email: string): Promise<User | null>;
  exists(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
  delete(email: string): Promise<void>;
  enableUser(email: string): Promise<void>;
}

@Injectable()
export class UserRepository implements IUserRepo {
  constructor(private prisma: PrismaService) {}

  async findUserByEmailWithRelations(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
        group_members: {
          select: {
            group_member_id: true,
          },
        },
        roles: {
          select: {
            id: true,
          },
        },
      },
    });

    if (user) {
      return UserMapper.fromUserPrismaWithRelationsToEntity(user);
    }
    return null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });

    if (user) {
      return UserMapper.fromUserPrismaToEntity(user);
    }
    return null;
  }

  async exists(email: string): Promise<boolean> {
    return !!(await this.prisma.user.findUnique({ where: { email } }));
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        username: user.username,
        roles: {
          connect: user.roles.map((roleId) => ({ id: roleId.toValue() })),
        },
        profile: {
          create: {
            last_connection: new Date(),
            date_of_birth: user.profile.date_of_birth
              ? new Date(user.profile.date_of_birth)
              : null,
            lang: user.profile.lang,
            photo: user.profile.photo,
          },
        },
      },
    });
  }

  async delete(email: string): Promise<void> {
    const deleteProfile = this.prisma.profile.delete({
      where: {
        userEmail: email,
      },
    });

    const deleteUser = this.prisma.user.delete({
      where: {
        email,
      },
    });

    await this.prisma.$transaction([deleteProfile, deleteUser]);
  }

  async enableUser(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        is_active: true,
      },
    });
  }
}
