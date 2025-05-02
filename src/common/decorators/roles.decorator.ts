import { SetMetadata } from '@nestjs/common';


export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);