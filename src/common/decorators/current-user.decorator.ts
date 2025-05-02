import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";


export const CurrentUser = createParamDecorator(
     (filter: string, context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();


          if (filter) {
               return request.user[filter];
          }

          if (!request.user) {
               throw new NotFoundException('User not found in request. Use AuthGuard to get the user')
          }

          return request.user;


     }
);