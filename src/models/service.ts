import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  price: number;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true }
});

export default mongoose.model<IService>('Service', ServiceSchema);