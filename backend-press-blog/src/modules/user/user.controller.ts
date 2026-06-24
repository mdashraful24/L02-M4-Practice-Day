import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req, res) => {
    const result = await userService.registerUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result
    });
});

const getMyProfile = catchAsync(async (req, res) => {
    const result = await userService.getMyProfileIntoDB(req.user?.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req, res) => {
    const userId = req.user?.id as string;

    const result = await userService.updateMyProfileIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile updated successfully!",
        data: result
    });
});


export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile,
};