import { RoleEnum } from "./role.enum";

export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    username!: string;
    role!: RoleEnum;
    email!: string;
    password!: string;
}