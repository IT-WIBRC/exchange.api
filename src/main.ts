import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { ValidationError } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const firstError = errors[errors.length - 1];
        return new BadRequestException({
          message:
            firstError.constraints[Object.keys(firstError.constraints)[0]],
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Exchange")
    .setDescription("Api to manage an exchange app like chat")
    .setVersion("0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    yamlDocumentUrl: "exchange.yaml",
  });
  await app.listen(3000);
}

bootstrap();
