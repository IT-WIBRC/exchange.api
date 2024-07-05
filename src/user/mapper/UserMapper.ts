import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Profile as PrismaProfile, Prisma } from "@prisma/client";
import { Profile } from "../entities/profile.entity";
import { LANG } from "../dto/LANGUAGE";
import { User } from "../entities/user.entity";

const userWithRelationIds = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    roles: {
      select: {
        id: true,
      },
    },
    profile: true,
    group_members: {
      select: {
        group_member_id: true,
      },
    },
  },
});

const userWithProfile = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    profile: true,
  },
});

type UserWithRelationIds = Prisma.UserGetPayload<typeof userWithRelationIds>;
type UserWithProfile = Prisma.UserGetPayload<typeof userWithProfile>;

export class UserMapper {
  private static fromPrismaGroupMemberToEntityId(
    groupMemberId: string,
  ): UniqueEntityID {
    return new UniqueEntityID(groupMemberId);
  }

  private static fromPrismaRoleToEntityId(roleId: string): UniqueEntityID {
    return new UniqueEntityID(roleId);
  }

  private static fromPrismaProfileToEntity(profile: PrismaProfile): Profile {
    return Profile.create(
      {
        lang: LANG[profile.lang],
        last_connection: profile.last_connection,
        date_of_birth: profile.date_of_birth,
        photo: profile.photo,
      },
      new UniqueEntityID(profile.id),
    );
  }

  static fromUserPrismaWithRelationsToEntity(user: UserWithRelationIds): User {
    return User.create(
      {
        email: user.email,
        isActive: user.is_active,
        username: user.username,
        createdAt: user.create_at,
        profile: UserMapper.fromPrismaProfileToEntity(user.profile),
        roles: user.roles.map((role) =>
          UserMapper.fromPrismaRoleToEntityId(role.id),
        ),
        password: user.password,
        groupMembers: user.group_members.map((groupMember) =>
          UserMapper.fromPrismaGroupMemberToEntityId(
            groupMember.group_member_id,
          ),
        ),
      },
      new UniqueEntityID(user.id),
    );
  }

  static fromUserPrismaToEntity(user: UserWithProfile): User {
    return User.create(
      {
        email: user.email,
        isActive: user.is_active,
        username: user.username,
        createdAt: user.create_at,
        roles: [],
        profile: UserMapper.fromPrismaProfileToEntity(user.profile),
        password: "",
      },
      new UniqueEntityID(user.id),
    );
  }
}
