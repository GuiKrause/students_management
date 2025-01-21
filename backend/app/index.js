import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import router from './routes/indexRouter.js';
import connectDB from './database/dbConnect.js';

// Load environment variables
dotenv.config();

// Create express app
const app = express()

// Middlewares
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // Enable CORS with environment-based configuration

// Connect to the database
connectDB();

// Register routes
app.use(router)

// Error handling middleware
app.use(errorHandler);

export default app