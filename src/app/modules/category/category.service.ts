import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (payload: ICategory) => {
  const isCategoryExist = await Category.findOne({ name: payload.name });
  
  if (isCategoryExist) {
    throw new Error('Category already exists!');
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
  // মঙ্গুস অটোমেটিক স্ট্রিং আইডি-কে অবজেক্ট আইডিতে কনভার্ট করে নেয়
  const result = await Category.findByIdAndDelete(id);
  return result;
};
export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  deleteCategoryFromDB
};