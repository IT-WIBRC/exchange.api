import { Result } from "../../../core/domain/Result";
import { UseCaseError } from "../../../core/domain/useCaseError";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignUpError {
  export class AccountAlreadyExists extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email ${email} associated for this account already exists`,
      } as UseCaseError);
    }
  }

  export class FacebookTokenInvalid extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `The facebook token used to attempt to create an account not genuine.`,
      } as UseCaseError);
    }
  }

  export class GoogleTokenInvalid extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `The google token used to attempt to create an account not genuine.`,
      } as UseCaseError);
    }
  }
}
