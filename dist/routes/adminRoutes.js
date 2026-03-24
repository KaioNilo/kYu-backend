"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
// Busca geral ou com filtro
router.get('/orders', adminController_1.getAllOrders);
// Busca por ID
router.get('/orders/:id', adminController_1.getOrderById);
// Atualiza dados ou status
router.put('/orders/:id', adminController_1.updateOrder);
// Remove pedido
router.delete('/orders/:id', adminController_1.deleteOrder);
exports.default = router;
