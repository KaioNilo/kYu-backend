import { Request, Response } from 'express';
import Order from '../models/order';
import Service from '../models/service';
import crypto from 'crypto';
import { sendAdminNotification, sendCustomerConfirmation } from '../services/emailService'; 
import { createOrderSchema } from '../schemas/orderSchema';

export const createOrder = async (req: Request, res: Response) => {
  try {
    // Validação robusta
    const validation = createOrderSchema.safeParse(req.body);

    // Se a validação falhar, retorna os erros detalhados
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Dados de formulário inválidos", 
        details: validation.error.format() 
      });
    }

    // Dados validados e tipados automaticamente
    const { customer, services: requestedServices, notes, lgpd } = validation.data;

    let totalAmount = 0;
    let hasCustomSite = false;
    const validatedServices = [];

    // Busca preços no BD
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

    // Salva no MongoDB
    await newOrder.save();

    // Dispara as notificações por e-mail (Admin e Cliente)
    sendAdminNotification(newOrder); 
    sendCustomerConfirmation(newOrder); 

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