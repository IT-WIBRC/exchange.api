import { Module } from "@nestjs/common";
import { RoleRepository } from "./repository/role.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { REPOSITORIES_PROVIDER } from "../helpers/constants";

const RoleRepo = {
  provide: REPOSITORIES_PROVIDER.ROLE,
  useClass: RoleRepository,
};

@Module({
  imports: [PrismaModule],
  providers: [RoleRepo],
  exports: [RoleRepo],
})
export class RoleModule {}
