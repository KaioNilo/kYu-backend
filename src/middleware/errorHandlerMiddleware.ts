import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    isJoi?: boolean;
    details?: any;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    
    // Log interno
    console.error(`[ERRO API] ${err.name}: ${err.message}`);
    
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Ocorreu um erro interno no servidor.',
        
        // Mostra detalhes técnicos se NÃO estiver em produção
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
        ...(err.isJoi && { details: err.details }) 
    });
};