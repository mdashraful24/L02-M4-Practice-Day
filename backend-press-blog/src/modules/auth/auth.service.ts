import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";
import { SelfErrorHandler } from "../../utils/handleErrors";
import { IUser } from "../user/user.interface"
import bcrypt from 'bcryptjs';
import { jwtUtils } from '../../utils/jwt';
import config from '../../config';
import { SignOptions } from 'jsonwebtoken';

const loginUserIntoDB = async (payload: IUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });

    if (user.activeStatus === "BLOCKED") {
        throw new SelfErrorHandler("Your account has been blocked. Please contact support.", httpStatus.FORBIDDEN);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new SelfErrorHandler("Incorrect password", httpStatus.UNAUTHORIZED);
    }

    await prisma.login.create({
        data: {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
    });

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt.accessSecret,
        config.jwt.accessExpiresIn as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt.refreshSecret,
        config.jwt.refreshExpiresIn as SignOptions
    )

    return {
        accessToken,
        refreshToken
    };
};


export const authService = {
    loginUserIntoDB,

}