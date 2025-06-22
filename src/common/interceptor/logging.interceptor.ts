import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Đảm bảo bạn import chalk đúng cách như thế này
import * as chalk from 'chalk';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  // Phương thức này dùng để lấy hàm màu dựa trên phương thức HTTP
  // LỖI CỦA BẠN RẤT CÓ THỂ NẰM Ở ĐÂY (dòng 47)
  private getMethodColor(method: string) {
    switch (method.toUpperCase()) {
      case 'GET':
        return chalk.green;
      case 'POST':
        return chalk.blue; // Đây là nơi bạn đang cố gắng gọi '.blue'
      case 'PUT':
        return chalk.yellow;
      case 'PATCH':
        return chalk.yellowBright;
      case 'DELETE':
        return chalk.red;
      default:
        return chalk.white; // Mặc định là màu trắng
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    // Lấy hàm màu từ phương thức ở trên
    const colorizer = this.getMethodColor(method);

    // Log request ban đầu
    this.logger.log(`[Request] ${colorizer(method)} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const delay = Date.now() - now;

        // Log response sau khi hoàn tất
        this.logger.log(
          `[Response] ${colorizer(
            method,
          )} ${url} - Status: ${statusCode} - ${delay}ms`,
        );
      }),
    );
  }
}