// Import all the dependencies
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv-safe';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Import Routes
import api from '@src/api';

// Import Middlewares
import { errorHandlerMiddleware, notFoundMiddleware } from '@src/middlewares';

const swaggerDocument = YAML.load(`${process.cwd()}/swagger/swagger.yaml`);

// const swaggerDocument = YAML.load('./docs/swagger.yaml');

// Access Environment variables
dotenv.config();

// Initialize app with express
const app: express.Application | undefined = express();

// Load App Middleware

app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);
app.use(cors());
// Serve all static files inside public directory.
app.use('/static', express.static('public'));

// Routes which Should handle the requests
app.use('/api/v1', api);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
