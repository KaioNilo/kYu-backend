import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

import { leadLimiter } from './middleware/rateLimitMiddleware';
import { errorHandler } from './middleware/errorHandlerMiddleware';

dotenv.config();

const app = express();

// --- Middlewares Globais ---
app.use(cors());
app.use(express.json());

// --- Rotas ---

// Rota base para teste
app.get('/', (req: Request, res: Response) => {
  res.send('API K&U rodando!');
});

// Proteção contra Spam na criação de orçamentos
app.use('/api/orcamentos', leadLimiter);

// Rotas Pública
app.use('/api', orderRoutes);

// Rota Autenticação
app.use('/api/auth', authRoutes);

// Rotas Admin Protegidas
app.use('/api/admin', adminRoutes);



// --- Conexão ao Banco de Dados ---
const mongoURL = process.env.MONGODB_URL as string;

mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// --- Tratamento de Erros ---
app.use(errorHandler);

// --- Inicialização ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});