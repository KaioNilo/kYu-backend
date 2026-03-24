"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, "O e-mail é obrigatório")
        .email("Insira um formato de e-mail válido"),
    password: zod_1.z.string()
        .min(1, "A senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caracteres")
});
