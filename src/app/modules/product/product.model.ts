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
    // isBestseller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    straight_up: { type: String },
    lowdown: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", productSchema);



// import { Schema, model } from "mongoose";
// import { IProduct } from "./product.interface";

// const productSchema = new Schema<IProduct>(
//   {
//     // 🧾 Basic Info
//     name: { type: String, required: true, trim: true },
//     slug: { type: String, unique: true, required: true },
//     description: { type: String, required: true },

//     // 💰 Pricing
//     costPrice: { type: Number, required: true },
//     regularPrice: { type: Number, required: true },
//     salePrice: { type: Number },
//     discountPercent: { type: Number, default: 0 },

//     // 📦 Inventory
//     stock: { type: Number, required: true, default: 0 },
//     sku: { type: String, unique: true, required: true },
//     lowStockAlert: { type: Number, default: 5 },

//     // 🖼️ Media
//     thumbnail: { type: String, required: true },
//     images: [{ type: String }],

//     // 🏷️ Branding & Categorization
//     brand: { type: String },
//     categoryID: {
//       type: Schema.Types.ObjectId,
//       ref: "Category",
//       required: true
//     },
//     tags: [{ type: String }],

//     // ⭐ Ratings & Reviews
//     rating: { type: Number, default: 0 },
//     numReviews: { type: Number, default: 0 },

//     // 🚀 Visibility / Status
//     status: {
//       type: String,
//       enum: ["active", "inactive", "draft"],
//       default: "active"
//     },
//     isFeatured: { type: Boolean, default: false },
//     isNew: { type: Boolean, default: true },

//     // 🚚 Shipping Info
//     weight: { type: Number }, // grams
//     shippingClass: {
//       type: String,
//       enum: ["normal", "fragile", "heavy"],
//       default: "normal"
//     },
//     freeShipping: { type: Boolean, default: false },

//     // 📏 Dimensions
//     dimensions: {
//       length: Number,
//       width: Number,
//       height: Number
//     },

//     // 🔍 SEO
//     metaTitle: { type: String },
//     metaDescription: { type: String },

//     // 🧠 Advanced / Internal
//     straight_up: { type: String },
//     lowdown: [{ type: String }]
//   },
//   {
//     timestamps: true
//   }
// );

// export const Product = model<IProduct>("Product", productSchema);