"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const service_1 = __importDefault(require("../models/service"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../services/emailService");
const orderSchema_1 = require("../schemas/orderSchema");
const createOrder = async (req, res) => {
    try {
        const validation = orderSchema_1.createOrderSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Dados de formulário inválidos",
                details: validation.error.format()
            });
        }
        const { customer, services: requestedServices, notes, lgpd } = validation.data;
        let totalAmount = 0;
        let hasCustomSite = false;
        const validatedServices = [];
        for (const item of requestedServices) {
            const officialService = await service_1.default.findOne({ name: item.description });
            if (!officialService) {
                return res.status(400).json({
                    error: `O serviço '${item.description}' não foi encontrado no catálogo oficial.`
                });
            }
            const unitPrice = officialService.price;
            totalAmount += unitPrice * (item.quantity || 1);
            if (item.description === "Site sob medida") {
                hasCustomSite = true;
            }
            validatedServices.push({
                description: item.description,
                quantity: item.quantity || 1,
                unitPrice: unitPrice
            });
        }
        const token = crypto_1.default.randomBytes(16).toString('hex');
        const newOrder = new order_1.default({
            customer,
            services: validatedServices,
            totalAmount,
            notes,
            token,
            lgpd: { ...lgpd, userIp: req.ip || '0.0.0.0' }
        });
        await newOrder.save();
        (0, emailService_1.sendAdminNotification)(newOrder);
        (0, emailService_1.sendCustomerConfirmation)(newOrder);
        let message = 'Orçamento gerado!';
        if (hasCustomSite) {
            message += ' Notamos que você solicitou um "Site sob medida". Em breve entraremos em contato para detalhes.';
        }
        res.status(201).json({ message, totalAmount, token });
    }
    catch (error) {
        console.error("ERRO NO CONTROLLER:", error);
        res.status(500).json({ error: 'Erro interno ao processar orçamento.' });
    }
};
exports.createOrder = createOrder;
