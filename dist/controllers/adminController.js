"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getAllOrders = void 0;
const order_1 = __importDefault(require("../models/order"));
// Listar pedidos com Filtro de Busca (Nome ou E-mail)
const getAllOrders = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        // Com termo de busca, filtra por nome ou e-mail usando Regex
        if (search) {
            query = {
                $or: [
                    { 'customer.name': { $regex: search, $options: 'i' } },
                    { 'customer.email': { $regex: search, $options: 'i' } }
                ]
            };
        }
        const orders = await order_1.default.find(query).sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao procurar pedidos', error });
    }
};
exports.getAllOrders = getAllOrders;
// Procurar pedido por ID
const getOrderById = async (req, res) => {
    try {
        const order = await order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao procurar o pedido', error });
    }
};
exports.getOrderById = getOrderById;
// Atualizar pedido
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await order_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Pedido não encontrado para atualizar' });
        }
        res.status(200).json({ message: 'Pedido atualizado com sucesso', updatedOrder });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar pedido', error });
    }
};
exports.updateOrder = updateOrder;
// Eliminar pedido
const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await order_1.default.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        res.status(200).json({ message: 'Dados removidos permanentemente conforme LGPD.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao eliminar pedido', error });
    }
};
exports.deleteOrder = deleteOrder;
