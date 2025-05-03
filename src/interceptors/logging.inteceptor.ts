import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
    
        const now = Date.now();
        console.log(`Incoming request: ${request.method} ${request.url}`);
    
        return next
        .handle()
        .pipe(
            tap(() => console.log(`Response status: ${response.statusCode} - Time taken: ${Date.now() - now}ms`)),
        );
    }
    }