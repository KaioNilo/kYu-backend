import { z } from 'zod';

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Formato de e-mail inválido"),
    phone: z.string().min(10, "Telefone inválido").max(15)
  }),
  services: z.array(z.object({
    description: z.string(),
    quantity: z.number().int().positive().default(1)
  })).nonempty("A lista de serviços não pode estar vazia"),
  notes: z.string().optional(),
  lgpd: z.object({
    termsConsent: z.boolean().refine(val => val === true, {
      message: "Você deve aceitar os termos da LGPD para prosseguir"
    })
  })
});