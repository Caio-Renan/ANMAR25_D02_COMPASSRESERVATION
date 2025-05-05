import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enum/roles.enum";


@Injectable()
export class RolesGuard implements CanActivate {
     constructor(private reflector: Reflector) { }
     async canActivate(context: ExecutionContext): Promise<boolean> {

          const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

          if (!requiredRoles || requiredRoles.length === 0) {
               return true;
          }

          const { user } = context.switchToHttp().getRequest();

          if (!user) {
               throw new ForbiddenException('User not found.');
          }

          const hasRole = requiredRoles.some((role) => user.role === role);
          if (!hasRole) {
               throw new ForbiddenException(`User with role '${user.role}' does not have permission to access this route.`);
          }
          return true;
     }
}