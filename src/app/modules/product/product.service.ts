import { IProduct } from "./product.interface";
import { Product } from "./product.model";

const createProductIntoDB = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

// const getAllProductsFromDB = async (query: Record<string, any>) => {
 
//   const { searchTerm, category, page = 1, limit = 10, ...filterData } = query;

//   const filter: any = { ...filterData };

//   if (searchTerm) {
//     filter.$or = [
//       { name: { $regex: searchTerm, $options: "i" } },
//       { description: { $regex: searchTerm, $options: "i" } },
//     ];
//   }


//   if (category) {
//     filter.categoryID = category;
//   }

//   const skip = (Number(page) - 1) * Number(limit);

  
//   const result = await Product.find(filter)
//     .populate("categoryID")
//     .sort("-createdAt")
//     .skip(skip)
//     .limit(Number(limit));

//   const total = await Product.countDocuments(filter);
//   const totalPage = Math.ceil(total / Number(limit));

//   return {
//     meta: { page: Number(page), limit: Number(limit), total, totalPage },
//     data: result,
//   };
// };
const getAllProductsFromDB = async (query: Record<string, any>) => {
  const { searchTerm, category, page = 1, limit = 8, sort, ...filterData } = query;

  const filter: any = { ...filterData };


  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }

  
  if (category && category !== "All Product") {
    filter.categoryID = category; 
  }


  
  let sortStr = "-createdAt";
  if (sort) {
    
    sortStr = sort as string;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const result = await Product.find(filter)
    .populate("categoryID")
    .sort(sortStr) 
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);
  const totalPage = Math.ceil(total / Number(limit));

  return {
    meta: { page: Number(page), limit: Number(limit), total, totalPage },
    data: result,
  };
};


const deleteProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id).populate('categoryID');
  
  if (!result) {
    throw new Error("Product not found!");
  }
  
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB
};