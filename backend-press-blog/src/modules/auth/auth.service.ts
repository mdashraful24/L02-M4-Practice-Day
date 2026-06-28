import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";
import { SelfErrorHandler } from "../../utils/handleErrors";
import { ILoginUser } from './auth.interface';
import bcrypt from 'bcryptjs';
import { jwtUtils } from '../../utils/jwt';
import config from '../../config';
import { JwtPayload, SignOptions } from 'jsonwebtoken';

const loginUserIntoDB = async (payload: ILoginUser) => {
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

const generateRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt.refreshSecret);

    if (!verifiedRefreshToken.success) {
        throw new SelfErrorHandler(verifiedRefreshToken.error);
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    if (user.activeStatus === "BLOCKED") {
        throw new SelfErrorHandler("Your account has been blocked. Please contact support.", httpStatus.FORBIDDEN);
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt.accessSecret,
        config.jwt.accessExpiresIn as SignOptions
    );

    return {
        accessToken
    };
};


export const authService = {
    loginUserIntoDB,
    generateRefreshToken
};