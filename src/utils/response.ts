import { Response } from "express";

export class HttpResponse {
  public static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    meta?: Record<string, unknown>
  ): Response {
    const responseBody: Record<string, unknown> = {
      status: statusCode === 200 || statusCode === 201 ? "ok" : statusCode,
      message,
    };

    if (meta) {
      responseBody.meta = meta;
    }

    if (data !== undefined) {
      responseBody.data = data;
    }

    return res.status(statusCode).json(responseBody);
  }

  public static fail(
    res: Response,
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ): Response {
    const responseBody: Record<string, unknown> = {
      status: "fail",
      message,
    };

    if (errors) {
      responseBody.errors = errors;
    }

    return res.status(statusCode).json(responseBody);
  }

  public static error(
    res: Response,
    statusCode: number = 500,
    message: string = "Internal server error"
  ): Response {
    return res.status(statusCode).json({
      status: "error",
      message,
    });
  }
}
