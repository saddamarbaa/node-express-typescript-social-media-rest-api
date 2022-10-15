// Import all the dependencies
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv-safe';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Import Routes
import api from '@src/api';

// Import Middlewares
import { errorHandlerMiddleware, notFoundMiddleware } from '@src/middlewares';

// Access Environment variables
dotenv.config();

// Initialize app with express
const app: express.Application | undefined = express();

// app.use(helmet());

// app.use(cookieParser());

// Load App Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Serve all static files inside public directory.
app.use('/static', express.static('public'));

// Routes which Should handle the requests
app.use('/api/v1', api);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
