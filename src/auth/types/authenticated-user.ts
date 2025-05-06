import { Role } from "../../common/enum/roles.enum"; 

export type AuthenticatedUser = {
    id: number;
    email: string;
    role: Role;
};