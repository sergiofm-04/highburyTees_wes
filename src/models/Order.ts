import mongoose, { Schema, Types } from 'mongoose';

export interface OrderItem {
  product: Types.ObjectId;
  qty: number;
  price: number;
}

export interface Order {
  user: Types.ObjectId;
  date: Date;
  address: string;
  cardHolder: string;
  cardNumber: string;
  items: OrderItem[];
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: () => new Date() },
    address: { type: String, required: true },
    cardHolder: { type: String, required: true },
    cardNumber: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true, default: [] },
  },
  { timestamps: true }
);

export default (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>('Order', OrderSchema);
