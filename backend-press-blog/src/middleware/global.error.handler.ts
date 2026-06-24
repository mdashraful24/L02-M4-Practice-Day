import httpStatus from 'http-status';
import { ErrorRequestHandler } from "express";
import { handleErrors } from "../utils/handleErrors";
import { sendResponse } from "../utils/sendResponse";

const globalErrHandler: ErrorRequestHandler = (error, req, res, next) => {
    const err = handleErrors(error);

    sendResponse(res, {
        statusCode: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: err.message || "Something went wrong",
    });
};

export default globalErrHandler;