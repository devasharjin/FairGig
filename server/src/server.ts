import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import dns from 'dns';
import authRoutes from './routes/auth/auth.routes';
import adminCategoryRoutes from './routes/admin/category.routes';
import adminServiceRoutes from './routes/admin/service.routes';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

dotenv.config({ quiet: true });

const app: Express = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (enabling cookies and credentials)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Standard Core Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Cooperative Gig Services API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/services', adminServiceRoutes);

// Error Middlewares (must be registered after routes)
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
