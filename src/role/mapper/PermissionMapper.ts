import { Permission as PrismaPermission } from "@prisma/client";
import { Permission } from "../entities/role.entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export default class PermissionMapper {
  static fromPrismaPermissionToEntity(
    permission: PrismaPermission,
  ): Permission {
    return Permission.create(
      {
        name: permission.name,
        description: permission.description,
        create_at: permission.created_at,
      },
      new UniqueEntityID(permission.id),
    );
  }
}
