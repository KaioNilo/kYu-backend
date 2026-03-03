import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

// Rotas
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

// Middlewares
import { leadLimiter } from './middleware/rateLimitMiddleware';
import { errorHandler } from './middleware/errorHandlerMiddleware';

// Configuração das variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares Globais

// Helmet
app.use(helmet()); 

// CORS
app.use(cors());

// JSON Parser
app.use(express.json());


// Rotas

// Rota base para verificação de saúde da API
app.get('/', (req: Request, res: Response) => {
  res.send('API K&U rodando!');
});

// Rota de Autenticação
app.use('/api/auth', authRoutes);

// Rotas de Orçamentos
app.use('/api/orcamentos', leadLimiter, orderRoutes);

// Rotas Admin
app.use('/api/admin', adminRoutes);


// Conexão BD
const mongoURL = process.env.MONGODB_URL as string;

mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));


// Tratamento de Erros Global
app.use(errorHandler);


// Inicialização do Servidor
const PORT = Number(process.env.PORT) || 3001; 
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});