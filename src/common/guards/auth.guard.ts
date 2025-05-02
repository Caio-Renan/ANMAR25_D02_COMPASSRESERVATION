import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {

     constructor(
          private readonly jwtService: JwtService,
          private readonly prisma: PrismaService,
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
               const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
               if (!user || user.status !== 'ACTIVE') {
                    throw new UnauthorizedException('User is inactive or does not exist');
               }
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
