import { ActiveStatus, Role } from "../../../generated/prisma/enums";

export interface IUser {
    name: string;
    email: string;
    password: string;
    activeStatus?: ActiveStatus;
    role?: Role;
    profilePhoto?: string;
    bio?: string;
}

export interface IUpdateUser {
    name?: string;
    email?: string;
    password?: string;
    activeStatus?: ActiveStatus;
    role?: Role;
    profilePhoto?: string;
    bio?: string;
}