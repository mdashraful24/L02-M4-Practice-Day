import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";
import { SelfErrorHandler } from "../../utils/handleErrors";
import { IUser } from "../user/user.interface"
import bcrypt from 'bcryptjs';
import { jwtUtils } from '../../utils/jwt';
import config from '../../config';
import { JwtPayload, SignOptions } from 'jsonwebtoken';

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

const generateRefreshToken = async (token: string) => {
    if (!token) {
        throw new SelfErrorHandler("You are not logged in. Please log in to access this resource.", httpStatus.UNAUTHORIZED);
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt.refreshSecret);

    if (!verifiedToken.success) {
        throw new SelfErrorHandler(verifiedToken.error);
    }

    const { id, name, email, role } = verifiedToken.data as JwtPayload;

    if (!role) {
        throw new SelfErrorHandler("Forbidden. You don't have permission to access this resource.", httpStatus.FORBIDDEN);
    }

    const user = await prisma.user.findUnique({
        where: { id, name, email, role }
    });

    if (!user) {
        throw new SelfErrorHandler("User not found. Please log in again.", httpStatus.BAD_REQUEST);
    }

    if (user.activeStatus === "BLOCKED") {
        throw new SelfErrorHandler("Your account has been blocked. Please contact support.", httpStatus.FORBIDDEN);
    }

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

    return { accessToken };
};


export const authService = {
    loginUserIntoDB,
    generateRefreshToken
};