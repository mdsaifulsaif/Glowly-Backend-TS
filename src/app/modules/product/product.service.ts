import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { Order } from "../order/order.model";

const createProductIntoDB = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, any>) => {
  const {
    searchTerm,
    category,
    page = 1,
    limit = 8,
    sort,
    ...filterData
  } = query;

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
  const result = await Product.findById(id).populate("categoryID");

  if (!result) {
    throw new Error("Product not found!");
  }

  return result;
};

const getBestsellingProductsFromDB = async (limit: number) => {
  const result = await Order.aggregate([
    // 1. cartItems array ke bhenge single document kora
    { $unwind: "$cartItems" },

    // 2. Product ID onujayi group kora ebong total quantity sum kora
    {
      $group: {
        _id: "$cartItems.product",
        totalSold: { $sum: "$cartItems.quantity" },
      },
    },

    // 3. Beshi bikri houa product gulo ke upore rakha
    { $sort: { totalSold: -1 } },

    // 4. Top products limit kora (e.g., top 10)
   { $limit: limit },

    // 5. Product collection theke full data niye asha
    {
      $lookup: {
        from: "products", // Apnar database e product collection er nam (prodhanto plural hoy)
        localField: "_id", // Group theke pawa product ID
        foreignField: "_id", // Product model er original ID
        as: "fullProduct", // Ei name data asbe
      },
    },

    // 6. lookup er result array hoye thake, seta ke object banano
    { $unwind: "$fullProduct" },

    // 7. Data format kora (jodi chan totalSold o thakbe abar product er shob data o thakbe)
    {
      $project: {
        _id: 0, // Aggregation er group ID baad deya
        totalSold: 1, // Koita bikri hoise seta rakhlam
        product: "$fullProduct", // Full product object ta 'product' field e rakhlam
      },
    },
  ]);

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  getBestsellingProductsFromDB,
};
