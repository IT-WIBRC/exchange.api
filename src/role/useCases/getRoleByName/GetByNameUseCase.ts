import { GenericAppError } from "../../../core/domain/AppError";
import { Either, Result, left, right } from "../../../core/domain/Result";
import { UseCase } from "../../../core/domain/useCase";
import { GetRoleDTO } from "./GetRoleDTO";
import { GetRoleByNameError } from "./GetRoleByNameError";
import { IRoleRepo } from "../../repository/role.repository";
import { Role } from "../../entities/role.entity";
import { Inject } from "@nestjs/common";
import { REPOSITORIES_PROVIDER } from "../../../helpers/constants";

type Response = Either<
  GenericAppError.UnexpectedError | GetRoleByNameError.RoleNotFound,
  Result<Role>
>;

export class GetByNameUseCase
  implements UseCase<GetRoleDTO, Promise<Response>>
{
  constructor(
    @Inject(REPOSITORIES_PROVIDER.ROLE) private roleRepo: IRoleRepo,
  ) {}

  async execute(request: GetRoleDTO): Promise<Response> {
    const role = Role.create({
      name: request.name,
    });

    let roleExistOrNot: Role | null;
    try {
      roleExistOrNot = await this.roleRepo.findRoleWithPermissionsByRoleName(
        role.name,
      );
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }

    if (!roleExistOrNot) {
      return left(new GetRoleByNameError.RoleNotFound(role.name)) as Response;
    }

    return right(Result.ok<Role>(role)) as Response;
  }
}
