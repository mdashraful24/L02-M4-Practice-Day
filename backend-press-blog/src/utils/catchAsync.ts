import httpStatus from 'http-status';
import { RequestHandler } from "express";
import { handleErrors } from "./handleErrors";
import { sendResponse } from "./sendResponse";

export const catchAsync = (fn: RequestHandler): RequestHandler => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            // const err = handleErrors(error);

            // sendResponse(res, {
            //     statusCode: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
            //     success: false,
            //     message: err.message
            // });

            next(error);
        }
    };
};