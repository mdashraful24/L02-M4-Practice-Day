import { Response } from "express";

type IResponse<T, E> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
    error?: E;
    author?: string;
    errorStack?: string;
};

export const sendResponse = <T, E>(res: Response, resData: IResponse<T, E>) => {
    res.status(resData.statusCode).json({
        success: resData.success,
        message: resData.message,
        data: resData.data,
        error: resData.error,
        errorStack: resData.error,
        author: resData.author
    });
};