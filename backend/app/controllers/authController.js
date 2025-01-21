import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import customError from "../utils/customError.js";

dotenv.config();

class AuthController {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email: email, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            next(error);
        }
    };

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) throw new customError('User not found', 401);
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) throw new customError('Incorrect credentials, try again', 401);
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
                expiresIn: '1h',
            });
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        };
    }
}

export default AuthController;