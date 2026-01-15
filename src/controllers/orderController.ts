import { Request, Response } from 'express';
import Order from '../models/order';
import crypto from 'crypto';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer, services, notes, lgpd } = req.body;

    // Cálculo do total
    const totalAmount = services.reduce((acc: number, item: any) => {
      return acc + (item.unitPrice * item.quantity);
    }, 0);

    // Gerar Token único
    const token = crypto.randomBytes(16).toString('hex');

    // Criar Pedido
    const newOrder = new Order({
      customer,
      services,
      totalAmount,
      notes,
      token,
      lgpd: {
        ...lgpd,
        userIp: req.ip // Captura IP
      }
    });

    await newOrder.save();

    // Lógica disparar e-mail de notificação (a fazer)

    res.status(201).json({ 
      message: 'Orçamento gerado!', 
      totalAmount, 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar orçamento.' });
  }
};