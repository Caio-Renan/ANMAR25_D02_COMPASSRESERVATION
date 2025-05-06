import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { logger } from "../config/logger"; 
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
    
        const now = Date.now();
        logger.info(`Incoming request: ${request.method} ${request.url}`);
    
        return next.handle().pipe(
            tap(() => {
              const duration = Date.now() - now;
              logger.info(`Response status: ${response.statusCode} - Time taken: ${duration}ms`);
            }),
          );
    }
}
