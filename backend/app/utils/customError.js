class customError extends Error {
    constructor(message, statusCode) {
        // Call super method for heritage of Error atributes and method,
        // and passing gived message for CustomError;
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        // Maybe we only can access the captureStackTrace with super()...
        Error.captureStackTrace(this, this.constructor);
    }
}

export default customError;