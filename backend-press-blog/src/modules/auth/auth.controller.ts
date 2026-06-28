import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service"

const loginUser = catchAsync(async (req, res) => {
    const result = await authService.loginUserIntoDB(req.body);

    const { accessToken, refreshToken } = result;

    res.cookie("accessToken", accessToken, {
        secure: false,      // * In production => true
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: result
    });
});

const authRefreshToken = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = await authService.generateRefreshToken(refreshToken);

    res.cookie("accessToken", accessToken,{
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Token refreshed successfully",
        data: { accessToken }
    });
});


export const authController = {
    loginUser,
    authRefreshToken
};