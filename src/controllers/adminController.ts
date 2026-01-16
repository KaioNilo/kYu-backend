import { Request, Response } from 'express';
import Order from '../models/order';

// Listar pedidos com Filtro de Busca (Nome ou E-mail)
export const getAllOrders = async (req: Request, res: Response) => {
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

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao procurar pedidos', error });
  }
};

// Procurar pedido por ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao procurar o pedido', error });
  }
};

// Atualizar pedido
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado para atualizar' });
    }

    res.status(200).json({ message: 'Pedido atualizado com sucesso', updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pedido', error });
  }
};

// Eliminar pedido
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Dados removidos permanentemente conforme LGPD.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao eliminar pedido', error });
  }
};