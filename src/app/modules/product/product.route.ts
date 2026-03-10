import { Router } from "express";
import { ProductControllers } from "./product.controller";
import { isAuthenticated, isAdmin } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware"; 

const router = Router();

router.post(
  "/create-product",
  isAuthenticated,
  isAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 }, 
  ]),
  ProductControllers.createProduct,
);

router.get("/", ProductControllers.getAllProducts);
router.delete("/:id", isAuthenticated, isAdmin, ProductControllers.deleteProduct)

export const ProductRoutes = router;
