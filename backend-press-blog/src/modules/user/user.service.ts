import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";
import { SelfErrorHandler } from "../../utils/handleErrors";
import { IUser } from "./user.interface"
import bcrypt from 'bcryptjs';
import config from '../../config';

const registerUserIntoDB = async (payload: IUser) => {
    const { name, email, password, activeStatus, role, profilePhoto, bio } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    });

    if (isUserExist) {
        throw new SelfErrorHandler("User already exists with this email", httpStatus.CONFLICT);
    }

    const hashPassword = await bcrypt.hash(password, Number(config.security.bcryptSaltRounds));

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            activeStatus,
            role
        }
    });

    await prisma.profile.create({
        data: {
            userId: createUser.id,
            profilePhoto,
            bio
        }
    });

    const user = await prisma.user.findUnique({
        where: { id: createUser.id },
        omit: { password: true },
        include: { profile: true }
    });

    return user;
};


export const userService = {
    registerUserIntoDB,

}