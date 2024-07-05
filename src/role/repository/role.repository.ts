import { PrismaService } from "../../prisma/prisma.service";
import { Role } from "../entities/role.entity";
import RoleMapper from "../mapper/RoleMapper";
import { Injectable } from "@nestjs/common";

export interface IRoleRepo {
  findRoleWithPermissionsByRoleName(name: string): Promise<Role | null>;
  exists(name: string): Promise<boolean>;
  save(role: Role): Promise<void>;
}

@Injectable()
export class RoleRepository implements IRoleRepo {
  constructor(private prisma: PrismaService) {}

  async findRoleWithPermissionsByRoleName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: {
        name,
      },
      include: {
        permissions: true,
      },
    });

    if (role) {
      return RoleMapper.fromPrismaRoleWithPermissionsToEntity(role);
    }
    return null;
  }

  async exists(name: string): Promise<boolean> {
    return !!(await this.prisma.role.findUnique({ where: { name } }));
  }

  async save(role: Role): Promise<void> {
    await this.prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
      },
    });
  }
}
