import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { Product } from "./product.model";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";

// const createProduct = catchAsync(async (req: Request, res: Response) => {
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   let productData = { ...req.body };

//   if (files && files.thumbnail && files.thumbnail[0]) {
//     const result: any = await uploadToCloudinary(
//       files.thumbnail[0].buffer,
//       "glowly_products/thumbnails",
//     );
//     productData.thumbnail = result.secure_url || result.url;
//   } else {
//     throw new Error("Product thumbnail is required!");
//   }

//   if (files && files.images && files.images.length > 0) {
//     const uploadPromises = files.images.map((file) =>
//       uploadToCloudinary(file.buffer, "glowly_products/gallery"),
//     );

//     const uploadResults: any[] = await Promise.all(uploadPromises);
//     productData.images = uploadResults.map((res) => res.secure_url || res.url);
//   }

//   const result = await ProductServices.createProductIntoDB(productData);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Product created successfully!",
//     data: result,
//   });
// });

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const { name, description, costPrice, regularPrice, categoryID, stock } = req.body;

  // ১. বেসিক ডাটা ভ্যালিডেশন (রিকোয়ার্ড ফিল্ড চেক)
  if (!name || !description || !costPrice || !regularPrice || !categoryID || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: name, description, costPrice, regularPrice, categoryID, and stock."
    });
  }

  // ২. টাইপ এবং ভ্যালু চেক (নাম্বার কি না এবং পজিটিভ কি না)
  if (Number(costPrice) <= 0 || Number(regularPrice) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Prices must be greater than zero."
    });
  }

  let productData = { 
    ...req.body,
    costPrice: Number(costPrice),
    regularPrice: Number(regularPrice),
    salePrice: req.body.salePrice ? Number(req.body.salePrice) : undefined,
    stock: Number(stock)
  };

  // ৩. ইমেজ ভ্যালিডেশন ও আপলোড
  if (files && files.thumbnail && files.thumbnail[0]) {
    const result: any = await uploadToCloudinary(
      files.thumbnail[0].buffer,
      "glowly_products/thumbnails",
    );
    productData.thumbnail = result.secure_url || result.url;
  } else {
    return res.status(400).json({
      success: false,
      message: "Product thumbnail is required!"
    });
  }

  if (files && files.images && files.images.length > 0) {
    const uploadPromises = files.images.map((file) =>
      uploadToCloudinary(file.buffer, "glowly_products/gallery"),
    );

    const uploadResults: any[] = await Promise.all(uploadPromises);
    productData.images = uploadResults.map((res) => res.secure_url || res.url);
  }

  // ৪. সব ঠিক থাকলে সার্ভিস কল
  const result = await ProductServices.createProductIntoDB(productData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProductsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.getSingleProductFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product retrieved successfully!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found!");
  }

  
  if (product.thumbnail) {
    const thumbPublicId = product.thumbnail.split('/').pop()?.split('.')[0];
    if (thumbPublicId) {
      await deleteFromCloudinary(`glowly_products/thumbnails/${thumbPublicId}`);
    }
  }


  if (product.images && product.images.length > 0) {
    const deletePromises = product.images.map((imgUrl) => {
      const imgPublicId = imgUrl.split('/').pop()?.split('.')[0];
      return imgPublicId 
        ? deleteFromCloudinary(`glowly_products/gallery/${imgPublicId}`) 
        : Promise.resolve();
    });
    await Promise.all(deletePromises);
  }

  await ProductServices.deleteProductFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product and associated images deleted successfully!",
    data: null,
  });
});




export const ProductControllers = {
  createProduct,
  getAllProducts,
  deleteProduct,
  getSingleProduct
};
