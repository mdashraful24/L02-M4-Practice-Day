type TErrorHandle = {
    message: string;
    statusCode?: number;
    stack?: string;
};

export class SelfErrorHandler extends Error {
    statusCode?: number

    constructor(message: string, statusCode?: number) {
        super(message)
        this.statusCode = statusCode
    };
};

export const handleErrors = (error: unknown): TErrorHandle => {
    if (error instanceof SelfErrorHandler) {
        return {
            message: error.message,
            statusCode: error.statusCode,
            stack: error.stack
        }
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            stack: error.stack
        }
    }

    return {
        message: "Something went wrong",
    }
};