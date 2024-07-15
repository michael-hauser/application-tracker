import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import nocache from 'nocache';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes';
import path from 'path';
import User from './models/User';
import Stage from './models/Stage';
import Application from './models/Application';
import { getSessionConfig } from './middleware/session';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(nocache());
app.use(express.json());
app.use(session(getSessionConfig(app)));
app.use(cookieParser(process.env.COOKIES_SECRET));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// API Routes
app.use('/api', routes);

// React App
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
