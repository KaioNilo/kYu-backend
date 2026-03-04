import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

import { leadLimiter } from './middleware/rateLimitMiddleware';
import { errorHandler } from './middleware/errorHandlerMiddleware';

dotenv.config();

const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

// Middlewares Globais
app.use(helmet()); 
app.use(express.json()); 

// Rotas
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes); 

app.get('/', (req: Request, res: Response) => {
  res.send('API K&U rodando com CORS configurado!');
});

// Rota de orçamentos com Rate Limit
app.use('/api/orcamentos', leadLimiter, orderRoutes); //

// Conexão BD
const mongoURL = process.env.MONGODB_URL as string;
mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB conectado com sucesso!')) //
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

app.use(errorHandler); //

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});