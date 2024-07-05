import { Role } from "../../entities/role.entity";
import RoleMapper from "../RoleMapper";

describe("PermissionMapper", () => {
  it("fromPrismaPermissionToEntity", () => {
    expect(
      RoleMapper.fromPrismaRoleWithPermissionsToEntity({
        id: "abseded",
        name: "User",
        description: "my awesome description",
        created_at: new Date(),
        updated_at: new Date(),
        permissions: [
          {
            id: "123",
            name: "user:read",
            created_at: new Date(),
            updated_at: new Date(),
            description: "Here he is",
          },
        ],
      }),
    ).toBeInstanceOf(Role);
  });
});
