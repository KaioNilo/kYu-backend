import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Autenticação e criação token JWT.
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validação Credenciais
    const isValidEmail = email === process.env.ADMIN_EMAIL;
    const isValidPassword = password === process.env.ADMIN_PASSWORD;

    // Se incorretas
    if (!isValidEmail || !isValidPassword) {
      const authError: any = new Error('E-mail ou senha de administrador incorretos.');
      authError.statusCode = 401;
      throw authError;
    }

    // Criação do Payload
    const payload = { 
      role: 'admin' 
    };

    // Assinatura do Token
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET as string, 
        { 
            expiresIn: (process.env.JWT_EXPIRES_IN as any) || '365d' 
        }
    );

    // Resposta Final
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      token 
    });

  } catch (error) {
    next(error);
  }
};