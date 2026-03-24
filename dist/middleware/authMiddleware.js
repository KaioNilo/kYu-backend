"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Salvar dados admin no objeto
        req.user = decoded;
        // Autorizar pro próximo passo 
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};
exports.protect = protect;
