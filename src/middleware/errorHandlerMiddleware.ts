import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Interface estendida para suportar códigos de status e detalhes do Zod
interface CustomError extends Error {
    statusCode?: number;
    details?: any;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Ocorreu um erro interno no servidor.';
    let details = err.details || null;

    // Tratamento específico para erros de validação do Zod
    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Dados de formulário inválidos';
        details = err.format(); // Formata o erro para ser legível no Frontend
    }

    // Log interno no console para o dev
    console.error(`[ERRO API] ${err.name}: ${message}`);
    
    // Mostra a pilha de erro (stack trace)
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // Resposta JSON
    res.status(statusCode).json({
        success: false,
        message: message,
        // Inclui detalhes de validação (Zod) se existirem
        ...(details && { details }),
        // Mostra a stack trace apenas se NÃO estiver em produção (segurança)
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};