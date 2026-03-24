"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authSchema_1 = require("../schemas/authSchema");
const catchAsync_1 = require("../utils/catchAsync");
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // Validação robusta com Zod
    const { email, password } = authSchema_1.loginSchema.parse(req.body);
    // Validação das Credenciais .env
    const isValidEmail = email === process.env.ADMIN_EMAIL;
    const isValidPassword = password === process.env.ADMIN_PASSWORD;
    // Se credenciais incorretas, erro personalizado
    if (!isValidEmail || !isValidPassword) {
        const authError = new Error('E-mail ou senha de administrador incorretos.');
        authError.statusCode = 401;
        throw authError;
    }
    // Criação do Payload para JWT
    const payload = {
        role: 'admin'
    };
    // Assinatura do Token .env
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '365d'
    });
    // Resposta final de sucesso
    return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        token
    });
});
