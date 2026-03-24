"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    customer: zod_1.z.object({
        name: zod_1.z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
        email: zod_1.z.string().email("Formato de e-mail inválido"),
        phone: zod_1.z.string().min(10, "Telefone inválido").max(15)
    }),
    services: zod_1.z.array(zod_1.z.object({
        description: zod_1.z.string(),
        quantity: zod_1.z.number().int().positive().default(1)
    })).nonempty("A lista de serviços não pode estar vazia"),
    notes: zod_1.z.string().optional(),
    lgpd: zod_1.z.object({
        termsConsent: zod_1.z.boolean().refine(val => val === true, {
            message: "Você deve aceitar os termos da LGPD para prosseguir"
        })
    })
});
