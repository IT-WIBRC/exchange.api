/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from "../../../core/domain/Result";
import { UseCaseError } from "../../../core/domain/useCaseError";

export namespace GetRoleByNameError {
  export class RoleNotFound extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `The role ${name} is not found`,
      } as UseCaseError);
    }
  }
}
