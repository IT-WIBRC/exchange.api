import { Result } from "../../../core/domain/Result";
import { UseCaseError } from "../../../core/domain/useCaseError";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ResendOtpError {
  export class UserNotFound extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The ${email} is not found`,
      } as UseCaseError);
    }
  }

  export class UserAlreadyActive extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The ${email} is already active`,
      } as UseCaseError);
    }
  }
}
