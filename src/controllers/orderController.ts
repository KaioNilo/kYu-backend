import { Request, Response } from 'express';
import Order from '../models/order';
import Service from '../models/service';
import crypto from 'crypto';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer, services: requestedServices, notes, lgpd } = req.body;

    // Validação entrada
    if (!requestedServices || !Array.isArray(requestedServices)) {
      return res.status(400).json({ error: 'A lista de serviços é obrigatória.' });
    }

    let totalAmount = 0;
    let hasCustomSite = false;
    const validatedServices = [];

    // Busca preços BD
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

    await newOrder.save();

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