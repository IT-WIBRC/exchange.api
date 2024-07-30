import { Response } from "express";

export abstract class BaseController {
  private res: Response;

  public execute(res: Response): void {
    this.res = res;
  }

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  public ok<T>(res: Response, dto?: T) {
    if (!!dto) {
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  public noContent(res: Response) {
    return res.sendStatus(204);
  }

  public clientError(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      400,
      message ? message : "Bad Request",
    );
  }

  public unauthorized(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      401,
      message ? message : "Unauthorized",
    );
  }

  public paymentRequired(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      402,
      message ? message : "Payment required",
    );
  }

  public forbidden(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      403,
      message ? message : "Forbidden",
    );
  }

  public notFound(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      404,
      message ? message : "Not found",
    );
  }

  public conflict(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      409,
      message ? message : "Conflict",
    );
  }

  public tooMany(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      429,
      message ? message : "Too many requests",
    );
  }

  public todo() {
    return BaseController.jsonResponse(this.res, 400, "TODO");
  }

  public fail(error: Error | string) {
    return this.res.status(500).json({
      message: typeof error === "string" ? error : error.message,
    });
  }
}
