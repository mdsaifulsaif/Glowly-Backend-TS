import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    costPrice: { type: Number, required: true },
    regularPrice: { type: Number, required: true },
    salePrice: { type: Number },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    categoryID: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    },
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    straight_up: { type: String },
    lowdown: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", productSchema);