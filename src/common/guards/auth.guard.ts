import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
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
          const authHeader = request.headers.authorization

          const token = authHeader.split(' ')[1];
          if (!token) {
               throw new BadRequestException('Token is missing or malformed');
          }

          try {
               const payload = this.jwtService.verify(token);
               request.user = payload;
               return true;
          } catch (error) {
               if (error.name === 'TokenExpiredError') {
                    throw new UnauthorizedException('Token has expired');
               } else if (error.name === 'JsonWebTokenError') {
                    throw new UnauthorizedException('Invalid token');
               } else {
                    throw new UnauthorizedException('Could not validate token');
               }
          }


     }

}
