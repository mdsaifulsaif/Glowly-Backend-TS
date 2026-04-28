import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { Product } from "../product/product.model";

const createCategoryIntoDB = async (payload: ICategory) => {
  const isExist = await Category.findOne({
    name: payload.name,
    isDeleted: false,
  });

  if (isExist) {
    throw new Error("Category already exists!");
  }

  return await Category.create(payload);
};

const getAllCategoriesFromDB = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const data = await Category.find({ isDeleted: false }) //  filter
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments({ isDeleted: false });

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

const deleteCategoryFromDB = async (id: string) => {
  const result = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

const getProductsByCategoryFromDB = async (
  categoryId: string,
  page: number,
  limit: number,
) => {
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw new Error("Category not found or deleted!");
  }

  const skip = (page - 1) * limit;

  const data = await Product.find({
    categoryID: categoryId,
  })
    .skip(skip)
    .limit(limit)
    .populate("categoryID");

  const total = await Product.countDocuments({
    categoryID: categoryId,
  });

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
