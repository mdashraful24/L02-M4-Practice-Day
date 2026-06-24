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


export const userController = {
    registerUser,

}