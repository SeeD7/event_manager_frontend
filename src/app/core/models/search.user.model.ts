import { RoleEnum } from "./role.enum";

export class SearchUser {
    firstName?: string;
    lastName?: string;
    username?: string;
    role?: RoleEnum[];
    email?: string;
}