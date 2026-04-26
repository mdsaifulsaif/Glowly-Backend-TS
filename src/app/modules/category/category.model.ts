import { Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: '__v',
  }
);

export const Category = model<ICategory>('Category', categorySchema);