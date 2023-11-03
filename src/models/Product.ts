import mongoose, { Schema, Types } from 'mongoose';

export interface Product {
  _id?: Types.ObjectId;
  name: string;
  synopsis: string;
  img: string;
  price: number;
}

const ProductSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

export default mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);