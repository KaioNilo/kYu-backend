import { Router } from 'express';
import { getAllOrders, getOrderById, updateOrder, deleteOrder} from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Busca geral ou com filtro
router.get('/orders', getAllOrders);

// Busca por ID
router.get('/orders/:id', getOrderById);

// Atualiza dados ou status
router.put('/orders/:id', updateOrder);

// Remove pedido
router.delete('/orders/:id', deleteOrder);

export default router;