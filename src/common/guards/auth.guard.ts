import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";


@Injectable()
export class AuthGuard implements CanActivate {

     constructor(
          private readonly jwtService: JwtService,
     ) { }

     async canActivate(context: ExecutionContext): Promise<boolean> {
          const request = context.switchToHttp().getRequest();
          const token = request.headers.authorization?.split(' ')[1];

          if (!token) {
               return false;
          }

          try {
               const payload = this.jwtService.verify(token);
               request.user = payload;
               return true;
          } catch(error) {
               return false;
          }


     }

}
