import { Prisma } from "@prisma/client";
import { Role } from "../entities/role.entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import PermissionMapper from "./PermissionMapper";

const roleWithRelation = Prisma.validator<Prisma.RoleDefaultArgs>()({
  include: {
    permissions: true,
  },
});

export type RoleWithRelation = Prisma.RoleGetPayload<typeof roleWithRelation>;
export default class RoleMapper {
  static fromPrismaRoleWithPermissionsToEntity(role: RoleWithRelation): Role {
    return Role.create(
      {
        name: role.name,
        permissions: role.permissions.map((permission) =>
          PermissionMapper.fromPrismaPermissionToEntity(permission),
        ),
      },
      new UniqueEntityID(role.id),
    );
  }
}
