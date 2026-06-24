type TErrorHandle = {
    message: string;
    statusCode?: number
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
            statusCode: error.statusCode
        }
    }

    if (error instanceof Error) {
        return {
            message: error.message
        }
    }

    return {
        message: "Something went wrong",
    }
};