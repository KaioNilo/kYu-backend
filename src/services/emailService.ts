import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAdminNotification = async (orderData: any) => {
  const { customer, services, totalAmount, notes } = orderData;

  // Formatação da lista de serviços para o HTML
  const servicesList = services.map((s: any) => 
    `<li>${s.description} (Qtd: ${s.quantity}) - R$ ${s.unitPrice.toFixed(2)}</li>`
  ).join('');

  try {
    await resend.emails.send({
      from: 'K&U Sistema <onboarding@resend.dev>', // E-mail padrão de teste do Resend
      to: process.env.EMAIL_RECEBEDOR || 'kaionilofreitas@gmail.com',
      subject: `🔔 Novo Orçamento: ${customer.name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Novo Orçamento Recebido</h2>
          <p><strong>Cliente:</strong> ${customer.name}</p>
          <p><strong>E-mail:</strong> ${customer.email}</p>
          <p><strong>Telefone:</strong> ${customer.phone}</p>
          <hr />
          <h3>Serviços Solicitados:</h3>
          <ul>${servicesList}</ul>
          <p><strong>Valor Total:</strong> R$ ${totalAmount.toFixed(2)}</p>
          <p><strong>Notas:</strong> ${notes || 'Nenhuma'}</p>
          <br />
          <p style="color: #666; font-size: 12px;">Este é um aviso automático do sistema K&U.</p>
        </div>
      `
    });
    console.log("📧 E-mail de notificação enviado com sucesso!");
  } catch (error) {
    console.error("❌ Falha ao enviar e-mail de notificação:", error);
  }
};