import { Result } from "../../../core/domain/Result";
import { UseCaseError } from "../../../core/domain/useCaseError";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EnableUserError {
  export class OtpHasExpired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "The otp has expired",
      } as UseCaseError);
    }
  }

  export class WrongOtp extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Wrong otp code provide",
      } as UseCaseError);
    }
  }

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

  export class NoOtpForThisUser extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The ${email} does not have any otp assigned`,
      } as UseCaseError);
    }
  }
}
