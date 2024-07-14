import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes';
import User from './models/User';
import Stage from './models/Stage';
import Application from './models/Application';

dotenv.config();

const PORT = process.env.PORT;
const COOKIES_SECRET = "super cookie secret";

const app = express();

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:3001', // Replace with your frontend URL during development
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(cookieParser(COOKIES_SECRET));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
