/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from "./Result";
import { UseCaseError } from "./useCaseError";

export namespace GenericAppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: any) {
      super(false, {
        message: "An unexpected error occurred.",
        error: err,
      } as UseCaseError);
      console.log("[AppError]: An unexpected error occurred");
      console.error(err);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
