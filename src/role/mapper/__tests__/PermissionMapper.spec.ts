import { Permission } from "../../entities/role.entity";
import PermissionMapper from "../PermissionMapper";

describe("PermissionMapper", () => {
  it("fromPrismaPermissionToEntity", () => {
    expect(
      PermissionMapper.fromPrismaPermissionToEntity({
        id: "abseded",
        name: "User",
        description: "my awesome description",
        created_at: new Date(),
        updated_at: new Date(),
      }),
    ).toBeInstanceOf(Permission);
  });
});
