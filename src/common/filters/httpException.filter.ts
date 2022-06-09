import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      (exception?.getResponse && exception?.getResponse()) ||
      exception?.message?.message ||
      exception?.message ||
      exception;
    const error = {
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(message);

    response.status(status).json(error);
  }
}
