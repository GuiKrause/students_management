import express from 'express';
import authRouter from './authRouter.js';
import studentRouter from './studentRouter.js';

const router = express.Router();

// Register your routes
router.use('/auth', authRouter);
router.use('/student', studentRouter);

export default router;
