"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Ocorreu um erro interno no servidor.';
    let details = err.details || null;
    // Tratamento específico para erros de validação do Zod
    if (err instanceof zod_1.ZodError) {
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
exports.errorHandler = errorHandler;
