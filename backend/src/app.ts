import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Import routes
import authRoutes from './routes/auth.routes';
import notesRoutes from './routes/notes.routes';
import memoriesRoutes from './routes/memories.routes';
import filesRoutes from './routes/files.routes';
import passwordsRoutes from './routes/passwords.routes';
import servicesRoutes from './routes/services.routes';
import clientsRoutes from './routes/clients.routes';
import paymentsRoutes from './routes/payments.routes';
import transactionsRoutes from './routes/transactions.routes';
import remindersRoutes from './routes/reminders.routes';
import whatsappRoutes from './routes/whatsapp.routes';
import securityRoutes from './routes/security.routes';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/passwords', passwordsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/security', securityRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
