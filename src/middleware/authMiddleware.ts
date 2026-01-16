import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Verificar token "Authorization"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Acesso negado. Token não fornecido ou formato inválido.' 
    });
  }

  // Extrair apenas o token
  const token = authHeader.split(' ')[1];

  try {
    // Validar token com Chave Secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Salvar dados admin no objeto
    req.user = decoded;

    // Autorizar pro próximo passo 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};