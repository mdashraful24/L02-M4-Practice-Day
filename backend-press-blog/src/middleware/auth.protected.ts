import httpStatus from 'http-status';
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { SelfErrorHandler } from '../utils/handleErrors';
import { jwtUtils } from '../utils/jwt';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const authProtector = (...requiredRoles: Role[]) => {
    return catchAsync(async (req, res, next) => {
        try {
            const token = req.cookies.accessToken ?
                req.cookies.accessToken
                : req.headers.authorization?.startsWith("Bearer ") ?
                    req.headers.authorization?.split(" ")[1]
                    : req.headers.authorization;

            if (!token) {
                throw new SelfErrorHandler("You are not logged in. Please log in to access this resource.", httpStatus.UNAUTHORIZED);
            }

            const verifiedToken = jwtUtils.verifyToken(token, config.jwt.accessSecret);

            if (!verifiedToken.success) {
                throw new SelfErrorHandler(verifiedToken.error);
            }

            const { id, name, email, role } = verifiedToken.data as JwtPayload;

            if (requiredRoles.length && !requiredRoles.includes(role)) {
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

            req.user = {
                id, name, email, role
            };

            next();
        } catch (error) {
            next(error)
        }
    });
};

export default authProtector;