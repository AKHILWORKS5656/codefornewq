import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import paymentRoutes from './routes/payments.js';
import webhookRoutes from './routes/webhooks.js';

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser middleware (except for webhooks which need raw body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Beauzead Ecommerce Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      payments: {
        createCheckout: 'POST /api/payments/create-checkout-session',
        retrieveSession: 'POST /api/payments/retrieve-session',
        createIntent: 'POST /api/payments/create-payment-intent',
      },
      webhooks: {
        stripe: 'POST /api/webhooks/stripe',
      },
    },
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    available_endpoints: {
      health: '/health',
      api: '/api/payments',
      webhooks: '/api/webhooks',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   Beauzead Ecommerce Backend Server Started            ║
╠════════════════════════════════════════════════════════╣
║   🚀 Server: http://localhost:${PORT}                    ║
║   📍 Frontend: ${FRONTEND_URL}              ║
║   🔧 Environment: ${process.env.NODE_ENV || 'development'}                         ║
║   💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Not configured'} ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
