import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true pra porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const enviarEmail = async (para: string, assunto: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"K&U Sistema" <${process.env.SMTP_USER}>`,
      to: para,
      subject: assunto,
      html: html,
    });
    console.log(`📧 E-mail enviado para ${para}`);
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
  }
};