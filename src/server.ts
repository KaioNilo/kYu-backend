import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

// Rotas
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

//Middlewares
import { leadLimiter } from './middleware/rateLimitMiddleware';
import { errorHandler } from './middleware/errorHandlerMiddleware';

dotenv.config();

const app = express();

// Middlewares Globais

// Helmet
app.use(helmet()); 

// CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
};
app.use(cors(corsOptions));

// JSON Parser
app.use(express.json());


// Rotas

// Teste de conexão
app.get('/', (req: Request, res: Response) => {
  res.send('API K&U rodando, protegida e com CORS configurado!');
});

// Autenticação
app.use('/api/auth', authRoutes);

// Orçamentos
app.use('/api/orcamentos', leadLimiter, orderRoutes);

// Admin
app.use('/api/admin', adminRoutes);


// Conexão BD
const mongoURL = process.env.MONGODB_URL as string;

mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));


// Tratamento de Erros Global
app.use(errorHandler);


// Inicialização
const PORT = Number(process.env.PORT) || 3001; 
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 CORS habilitado para: http://localhost:3000`);
});