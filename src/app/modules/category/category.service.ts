import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { Product } from "../product/product.model";

const createCategoryIntoDB = async (payload: ICategory) => {
  const isCategoryExist = await Category.findOne({ name: payload.name });

  if (isCategoryExist) {
    throw new Error("Category already exists!");
  }

  const result = await Category.create(payload);
  return result;
};

const getAllCategoriesFromDB = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const result = await Category.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments();
  const totalPage = Math.ceil(total / limit);

  return {
    meta: { page, limit, total, totalPage },
    data: result,
  };
};

// category.service.ts
const deleteCategoryFromDB = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
};

const getProductsByCategoryFromDB = async (
  categoryId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const data = await Product.find({ categoryID: categoryId })
    .skip(skip)
    .limit(limit)
    .populate("categoryID"); 

  const total = await Product.countDocuments({ categoryID: categoryId });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  deleteCategoryFromDB,
  getProductsByCategoryFromDB,
};
