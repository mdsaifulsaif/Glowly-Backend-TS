import express from "express";
import { SettingControllers } from "./setting.controller";
import { isAdmin, isAuthenticated } from "../../middlewares/auth.middleware";


const router = express.Router();

router.get("/", SettingControllers.getSettings);

router.patch(
  "/update",
  isAuthenticated,
  isAdmin,
  SettingControllers.updateSettings
);

export const SettingRoutes = router;