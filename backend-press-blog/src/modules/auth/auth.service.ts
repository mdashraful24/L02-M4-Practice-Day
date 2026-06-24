import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";
import { SelfErrorHandler } from "../../utils/handleErrors";
import { IUser } from "../user/user.interface"
import bcrypt from 'bcryptjs';

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

    return user;
};


export const authService = {
    loginUserIntoDB,

}