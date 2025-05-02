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
               throw new ForbiddenException('Sem permissão definida.');
          }

          const { user } = context.switchToHttp().getRequest();

          if (!user) {
               throw new ForbiddenException('Usuário não encontrado.');
          }

          if (!requiredRoles.includes(user.role)) {
               throw new ForbiddenException(`Role ${user.role} não autorizado.`);
          }

          return true;
     }
}