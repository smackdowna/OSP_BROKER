import express from 'express';
import cors from 'cors';
// import router from './app/routes';
import cookieParser from 'cookie-parser';
import notFoundHandler from './app/middlewares/notFoundHandler';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

// Enable cookie parsing
app.use(cookieParser());

// Middleware for parsing JSON bodies
app.use(express.json());

// app.use(express.static("./uploads"));
// Middleware for handling CORS with credentials
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
// app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to OSP_BROKER");
});

// Application routes
// app.use('/api', router);

// Catch-all route for handling 404 errors
app.use(notFoundHandler);

// Global error handling middleware
app.use(globalErrorHandler);

export default app;