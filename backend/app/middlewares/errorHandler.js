import dotenv from "dotenv";

dotenv.config();

const errorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Something went wrong";
    res.status(error.statusCode).json({
        status: process.env.DEVELOPMENT == 'true' ? error.status : undefined,
        statusCode: error.statusCode,
        message: error.message,
        stack: process.env.DEVELOPMENT == 'true' ? error.stack : undefined,
    });
}

export default errorHandler;