import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import customError from '../utils/customError.js';

dotenv.config();

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new customError('Access denied: No token provided', 401);
    const token = authHeader.split('Bearer ')[1];
    if (!token) throw new customError('Access denied: No token provided', 401);
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        next(error)
    }
};

export default verifyToken;