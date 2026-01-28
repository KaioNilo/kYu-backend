import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/service';

dotenv.config();

const services = [
  { name: "Landing Page", price: 4000.00 },
  { name: "Site sob medida", price: 0.00 },
  { name: "Logomarca", price: 500.00 },
  { name: "Identidade Visual", price: 1500.00 },
  { name: "Ilustração", price: 400.00 },
  { name: "1 Post estático", price: 100.00 },
  { name: "1 Post estático + Story", price: 150.00 },
  { name: "1 Post carrossel [Até 10 peças]", price: 400.00 },
  { name: "1 Post carrossel + Stories [Até 20 peças]", price: 600.00 },
  { name: "1 Reels [1 peça de até 1 min]", price: 300.00 },
  { name: "Assinatura de Email", price: 50.00 },
  { name: "Cartão de Visita", price: 50.00 },
  { name: "Papel Timbrado", price: 50.00 },
  { name: "Panfleto [A5/A6]", price: 150.00 },
  { name: "Panfleto [A4]", price: 150.00 },
  { name: "Folder [A4]", price: 200.00 },
  { name: "Banner", price: 100.00 },
  { name: "Bandeira", price: 100.00 },
  { name: "Blusa", price: 150.00 },
  { name: "Botton", price: 50.00 },
  { name: "Cartaz", price: 100.00 },
  { name: "Backdrop", price: 80.00 },
  { name: "Windbanner", price: 50.00 },
  { name: "Diagramação [Por Página]", price: 30.00 },
  { name: "Kit de Ícones/Destaques [Stories]", price: 100.00 },
  { name: "Anúncio", price: 100.00 },
  { name: "Apresentação Profissional [Por Slide]", price: 30.00 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("✅ Conectado ao MongoDB para atualização de preços...");

    // Limpar e aplicar alterações
    await Service.deleteMany({});
    
    // Inserir lista atualizada
    await Service.insertMany(services);
    
    console.log("🌱 Base de dados atualizada com sucesso!");
    process.exit();
  } catch (error) {
    console.error("❌ Erro ao atualizar a base de dados:", error);
    process.exit(1);
  }
};

seedDB();