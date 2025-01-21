import app from './app/index.js';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Set the port
const port = process.env.PORT || '3000'

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});