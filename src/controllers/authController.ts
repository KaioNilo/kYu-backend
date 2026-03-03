import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../schemas/authSchema'; 

// Autenticação e criação token JWT
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validação robusta
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ 
        success: false,
        error: "Dados de login inválidos", 
        details: validation.error.format() 
      });
    }

    const { email, password } = validation.data;

    // Validação Credenciais .env
    const isValidEmail = email === process.env.ADMIN_EMAIL;
    const isValidPassword = password === process.env.ADMIN_PASSWORD;

    // Se incorretas
    if (!isValidEmail || !isValidPassword) {
      const authError: any = new Error('E-mail ou senha de administrador incorretos.');
      authError.statusCode = 401;
      throw authError;
    }

    // Criação Payload JWT
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

    // Resposta Final de sucesso
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      token 
    });

  } catch (error) {
    // Encaminha o erro para o middleware de tratamento global
    next(error);
  }
};