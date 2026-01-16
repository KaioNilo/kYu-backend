import rateLimit from 'express-rate-limit';

export const leadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, 
    message: {
        success: false,
        message: "Muitas requisições desta origem. Por favor, tente novamente após 15 minutos."
    },
    standardHeaders: true, 
    legacyHeaders: false,
});