import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../schemas/authSchema';
import { catchAsync } from '../utils/catchAsync'; 

export const login = catchAsync(async (req: Request, res: Response) => {
  // Validação robusta com Zod
  const { email, password } = loginSchema.parse(req.body);

  // Validação das Credenciais .env
  const isValidEmail = email === process.env.ADMIN_EMAIL;
  const isValidPassword = password === process.env.ADMIN_PASSWORD;

  // Se credenciais incorretas, erro personalizado
  if (!isValidEmail || !isValidPassword) {
    const authError: any = new Error('E-mail ou senha de administrador incorretos.');
    authError.statusCode = 401; 
    throw authError;
  }

  // Criação do Payload para JWT
  const payload = { 
    role: 'admin' 
  };

  // Assinatura do Token .env
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET as string, 
    { 
      expiresIn: (process.env.JWT_EXPIRES_IN as any) || '365d' 
    }
  );

  // Resposta final de sucesso
  return res.status(200).json({
    success: true,
    message: 'Login realizado com sucesso!',
    token 
  });
});