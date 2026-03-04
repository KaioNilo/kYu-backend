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

// Middlewares Globais
app.use(helmet()); // Blindagem de cabeçalhos
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); //

// Rotas

app.use('/api/auth', authRoutes); //
app.use('/api/admin', adminRoutes); //

app.get('/', (req: Request, res: Response) => {
  res.send('API K&U rodando e integrada ao n8n!');
});

// Rate Limit rota pública
app.use('/api/orcamentos', leadLimiter, orderRoutes);

// Conexão BD
const mongoURL = process.env.MONGODB_URL as string;

mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB conectado com sucesso!')) //
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Tratamento de Erros
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});