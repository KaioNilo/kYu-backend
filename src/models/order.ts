import mongoose, { Schema, Document } from 'mongoose';

// Interface Obj
export interface IOrder extends Document {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  services: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: 'aguardando_confirmacao' | 'servico_solicitado' | 'cancelado';
  notes?: string;
  token: string;
  date?: Date;
  lgpd: {
    termsConsent: boolean;
    acceptanceDate: Date;
    userIp: string;
  };
}

// Schema
const OrderSchema: Schema = new Schema({
  customer: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
  },
  services: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['aguardando_confirmacao', 'servico_solicitado', 'cancelado'], 
    default: 'aguardando_confirmacao' 
  },
  notes: { type: String },
  token: { type: String, required: true, unique: true, index: true },
  date: { type: Date },
  lgpd: {
    termsConsent: { type: Boolean, required: true },
    acceptanceDate: { type: Date, default: Date.now },
    userIp: { type: String }
  }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);