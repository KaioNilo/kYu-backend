import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/service';

dotenv.config();

const services = [
  { name: "Landing Page", price: 4000.00 },
  { name: "Site sob medida", price: 0.00 },
  { name: "Logomarca", price: 300.00 },
  { name: "Identidade Visual", price: 1500.00 },
  { name: "Post estático", price: 50.00 },
  { name: "Post estático + Story", price: 80.00 },
  { name: "Post carrossel", price: 200.00 },
  { name: "Post carrossel + Stories", price: 380.00 },
  { name: "Reels [1min]", price: 250.00 },
  { name: "Assinatura de Email", price: 30.00 },
  { name: "Cartão de Visita", price: 30.00 },
  { name: "Papel Timbrado", price: 20.00 },
  { name: "Panfleto [A5/A6]", price: 70.00 },
  { name: "Panfleto [A4]", price: 100.00 },
  { name: "Folder [A4]", price: 100.00 },
  { name: "Banner", price: 50.00 },
  { name: "Bandeira", price: 50.00 },
  { name: "Blusa", price: 70.00 },
  { name: "Botton", price: 30.00 },
  { name: "Cartaz", price: 50.00 },
  { name: "Backdrop", price: 50.00 },
  { name: "Windbanner", price: 50.00 },
  { name: "Diagramação [Pág]", price: 20.00 },
  { name: "Kit de Ícones/Destaques", price: 80.00 },
  { name: "Anúncio", price: 100.00 },
  { name: "Apresentação Profissional [Pág]", price: 20.00 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("✅ Conectado ao MongoDB para seeding...");

    // Limpar e evitar duplicados
    await Service.deleteMany({});
    
    // Insere serviços
    await Service.insertMany(services);
    
    console.log("🌱 Base de dados populada com sucesso!");
    process.exit();
  } catch (error) {
    console.error("❌ Erro ao popular a base de dados:", error);
    process.exit(1);
  }
};

seedDB();