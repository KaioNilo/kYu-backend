import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Estilos comuns para manter a identidade
const emailStyle = {
  container: "font-family: 'Cascadian Code', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #F2F9FF; border-radius: 8px; overflow: hidden;",
  header: "background-color: #2322E3; color: #f2f9ff; padding: 30px; text-align: center;",
  body: "background-color: #9A67FF; padding: 30px; color: #f2f9ff; line-height: 1.6;",
  footer: "background-color: #F2F9FF; color: #202020; padding: 20px; text-align: center; font-size: 12px;",
  highlight: "color: #202020; font-weight: bold;",
  linkOverride: "color: #202020 !important; text-decoration: none !important;"
};

// Função Notificar Admin
export const sendAdminNotification = async (orderData: any) => {
  const { customer, services, totalAmount } = orderData;
  const servicesList = services.map((s: any) => `<li>${s.description} (x${s.quantity})</li>`).join('');

  try {
    await resend.emails.send({
      from: 'K&U Sistema <onboarding@resend.dev>',
      to: process.env.EMAIL_RECEBEDOR || 'kaionilofreitas@gmail.com',
      subject: `🔔 Novo Orçamento: ${customer.name}`,
      html: `
        <div style="${emailStyle.container}">
          <div style="${emailStyle.header}"><h1>Novo Pedido</h1></div>
          <div style="${emailStyle.body}">
            <p><strong>Cliente:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <hr style="border: 0; border-top: 1px solid #F2F9FF; margin: 20px 0;" />
            <h3>Itens solicitados:</h3>
            <ul>${servicesList}</ul>
            <p style="font-size: 18px;"><strong>Total: R$ ${totalAmount.toFixed(2)}</strong></p>
          </div>
        </div>`
    });
  } catch (error) {
    console.error("❌ Erro no e-mail admin:", error);
  }
};

// Confirmar para o Cliente
export const sendCustomerConfirmation = async (orderData: any) => {
  const { customer } = orderData;

  try {
    await resend.emails.send({
      from: 'K&U <onboarding@resend.dev>',
      to: customer.email,
      subject: `Recebemos seu pedido, ${customer.name}!`,
      html: `
        <div style="${emailStyle.container}">
          <div style="${emailStyle.header}">
            <h1 style="margin:0;">K&U</h1>
          </div>
          <div style="${emailStyle.body}">
            <h2 style="color: #F2F9FF;">Olá, ${customer.name}!</h2>
            <p>Obrigado por entrar em contato conosco. Recebemos sua solicitação de orçamento com sucesso.</p>
            <p>Nossa equipe já está analisando os detalhes e, <strong>em breve, entraremos em contato</strong> para conversar sobre os próximos passos do seu projeto.</p>
          </div>
          <div style="${emailStyle.footer}">
            <p>&copy; K&U. Todos os direitos reservados.</p>
          </div>
        </div>`
    });
    console.log("📧 Confirmação enviada para o cliente!");
  } catch (error) {
    console.error("❌ Erro no e-mail cliente:", error);
  }
};