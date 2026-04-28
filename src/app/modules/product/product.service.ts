import { GetProductsParams, IProduct } from "./product.interface";
import { Product } from "./product.model";
import { Order } from "../order/order.model";
import slugify from "slugify";

export const createProductIntoDB = async (payload: IProduct) => {
  //  1. slug auto generate
  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true, strict: true });
  }

  //  2. sale price validation
  if (payload.salePrice && payload.salePrice >= payload.regularPrice) {
    throw new Error("Sale price must be less than regular price");
  }

  //  3. discount percent auto calculate
  if (payload.salePrice) {
    payload.discountPercent = Math.round(
      ((payload.regularPrice - payload.salePrice) / payload.regularPrice) * 100
    );
  } else {
    payload.discountPercent = 0;
  }

  //  4. default status fix
  if (!payload.status) {
    payload.status = "active";
  }

  //  5. SKU fallback (optional)
  if (!payload.sku) {
    payload.sku = `SKU-${Date.now()}`;
  }

  const result = await Product.create(payload);
  return result;
};

const updateProductIntoDB = async (id: string, payload: Partial<IProduct>) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // 🔥 salePrice validation
  if (
    payload.salePrice &&
    payload.regularPrice &&
    payload.salePrice >= payload.regularPrice
  ) {
    throw new Error("Sale price must be less than regular price");
  }

  // 🔥 discount auto calculate
  if (payload.salePrice) {
    payload.discountPercent = Math.round(
      ((payload.regularPrice! - payload.salePrice) /
        payload.regularPrice!) *
        100
    );
  }

  const updated = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

export const getNewProductsService = async (params: GetProductsParams) => {
  const { isNew, limit } = params;

  // max 4 enforce
  const safeLimit = Math.min(Number(limit) || 4, 4);

  const filter: any = {};

  if (isNew === "true") {
    filter.isNew = true;
  }

  const products = await Product.find(filter)
    .limit(safeLimit)
    .sort({ createdAt: -1 });

  return products;
};


const getAllProductsFromDB = async (query: Record<string, any>) => {
  const {
    searchTerm,
    category,
    tag, // ট্যাগ ফিল্টার
    page = 1,
    limit = 8,
    sort,
    ...filterData
  } = query;

  const filter: any = { ...filterData };

  // ১. সার্চ লজিক (নাম, ডেসক্রিপশন এবং ট্যাগের ভেতর খুঁজবে)
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } }, // এই লাইনটি যোগ করা হয়েছে
    ];
  }

  // ২. ক্যাটাগরি ফিল্টার
  if (category && category !== "All Product") {
    filter.categoryID = category;
  }

  // ৩. স্পেসিফিক ট্যাগ ফিল্টার (ইউজার যখন নির্দিষ্ট ট্যাগে ক্লিক করবে)
  if (tag) {
    filter.tags = { $in: [tag] }; 
  }

  // ৪. সর্টিং
  let sortStr = "-createdAt";
  if (sort) {
    sortStr = sort as string;
  }

  // ৫. প্যাগিনেশন ক্যালকুলেশন
  const skip = (Number(page) - 1) * Number(limit);

  // ডাটা ফেচ করা
  const result = await Product.find(filter)
    .populate("categoryID")
    .sort(sortStr)
    .skip(skip)
    .limit(Number(limit));

  // মেটা ডাটা ক্যালকুলেশন
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

const getRelatedProductsFromDB = async (categoryId: string, productId: string) => {
  const result = await Product.find({
    categoryID: categoryId,      // Same category hote hobe
    _id: { $ne: productId }      // $ne mane 'Not Equal' - mane current product bad diye
  })
  .limit(4)                      // Figma design e 4ti product ache
 .populate("categoryID")

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  getBestsellingProductsFromDB,
  getRelatedProductsFromDB,
  updateProductIntoDB,
  getNewProductsService
};
