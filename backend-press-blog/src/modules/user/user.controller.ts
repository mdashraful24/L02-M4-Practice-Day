import { TypeController } from "../../types/express.types";
import { handleErrors } from "../../utils/handleErrors";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import httpStatus from "http-status";

const registerUser: TypeController = async (req, res) => {
    try {
        const result = await userService.registerUserIntoDB(req.body);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User registered successfully!",
            data: result
        })
    } catch (error) {
        const err = handleErrors(error);

        sendResponse(res, {
            statusCode: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: err.message
        })
    }
}


export const userController = {
    registerUser,

}