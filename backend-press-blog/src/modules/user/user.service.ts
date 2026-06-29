import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { IUpdateUser, IUser } from "./user.interface"
import { prisma } from "../../lib/prisma";
import { SelfErrorHandler } from '../../utils/handleErrors';
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
            role,
            profile: {
                create: {
                    profilePhoto,
                    bio
                }
            }
        }
    });

    // await prisma.profile.create({
    //     data: {
    //         userId: createUser.id,
    //         profilePhoto,
    //         bio
    //     }
    // });

    const user = await prisma.user.findUnique({
        where: { id: createUser.id },
        omit: { password: true },
        include: { profile: true }
    });

    return user;
};

const getMyProfileIntoDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: { password: true },
        include: { profile: true }
    });

    return user;
};

const updateMyProfileIntoDB = async (userId: string, payload: IUpdateUser) => {
    const { name, email, password, profilePhoto, bio } = payload;

    let hashPassword;

    if (password) {
        hashPassword = await bcrypt.hash(
            password,
            Number(config.security.bcryptSaltRounds)
        );
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            ...(hashPassword && { password: hashPassword }),
            profile: {
                update: {
                    profilePhoto,
                    bio
                }
            }
        },
        omit: { password: true },
        include: { profile: true }
    });

    return updatedUser;
};


export const userService = {
    registerUserIntoDB,
    getMyProfileIntoDB,
    updateMyProfileIntoDB,
};