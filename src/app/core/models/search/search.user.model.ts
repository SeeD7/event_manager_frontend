import { RoleEnum } from "../business/role.enum";

export class SearchUser {
    firstName?: string;
    lastName?: string;
    username?: string;
    role?: RoleEnum[];
    email?: string;
}