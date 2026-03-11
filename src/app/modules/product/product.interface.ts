import { Types } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  costPrice: number;
  regularPrice: number;
  salePrice?: number;
  thumbnail: string;
  images: string[];
  categoryID: Types.ObjectId;
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  straight_up: string;
  lowdown: string[];
}