import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURL = process.env.MONGODB_URL as string;

mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB conectado!'))
  .catch((err) => console.error('❌ Erro:', err));

app.get('/', (req: Request, res: Response) => {
  res.send('API k&u rodando!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});