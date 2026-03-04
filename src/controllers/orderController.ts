import { Request, Response } from 'express';
import axios from 'axios';
import Order from '../models/order';
import Service from '../models/service';
import crypto from 'crypto';
import { createOrderSchema } from '../schemas/orderSchema';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validation = createOrderSchema.safeParse(req.body); 

    if (!validation.success) {
      return res.status(400).json({ 
        error: "Dados de formulário inválidos", 
        details: validation.error.format() 
      }); 
    }

    const { customer, services: requestedServices, notes, lgpd } = validation.data; //

    let totalAmount = 0;
    let hasCustomSite = false;
    const validatedServices = [];

    for (const item of requestedServices) {
      const officialService = await Service.findOne({ name: item.description });
      
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

    const token = crypto.randomBytes(16).toString('hex');

    const newOrder = new Order({
      customer,
      services: validatedServices,
      totalAmount,
      notes,
      token,
      lgpd: { 
        ...lgpd, 
        userIp: req.ip || '0.0.0.0' 
      }
    });

    await newOrder.save(); // Salva no MongoDB

    // INTEGRAÇÃO N8N
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      axios.post(n8nWebhookUrl, {
        event: "new_order",
        orderId: newOrder._id,
        customer: newOrder.customer,
        services: newOrder.services,
        totalAmount: newOrder.totalAmount,
        notes: newOrder.notes,
        createdAt: new Date().toISOString()
      }).catch(err => console.error("⚠️ Erro ao enviar para o n8n:", err.message));
    }

    let message = 'Orçamento gerado!';
    if (hasCustomSite) {
      message += ' Notamos que você solicitou um "Site sob medida". Em breve entraremos em contato para detalhes.';
    }

    res.status(201).json({ message, totalAmount, token });

  } catch (error) {
    console.error("ERRO NO CONTROLLER:", error);
    res.status(500).json({ error: 'Erro interno ao processar orçamento.' });
  } 
};