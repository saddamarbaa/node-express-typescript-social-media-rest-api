// Import all the dependencies
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv-safe';

// Import Routes
import api from '@src/api';

// Import Middlewares
import { errorHandlerMiddleware, notFoundMiddleware } from '@src/middlewares';

// Access Environment variables
dotenv.config();

// Initialize app with express
const app = express();

// Load App Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes which Should handle the requests
app.use('/api/v1', api);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
