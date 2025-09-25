import mongoose, { Schema } from 'mongoose';

export interface Product {
	name: string;
	description: string;
	img: string;
	price: number;
}

const ProductSchema = new Schema<Product>(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		img: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
	},
	{ timestamps: true }
);

export default (mongoose.models.Product as mongoose.Model<Product>) ||
	mongoose.model<Product>('Product', ProductSchema);
