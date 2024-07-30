import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

export default () =>
  new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    transform: true,
    skipMissingProperties: false,
    exceptionFactory: (errors: ValidationError[]) => {
      const firstError = errors[0];
      return new BadRequestException({
        message: firstError.constraints[Object.keys(firstError.constraints)[0]],
      });
    },
  });
