import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Setting } from "./setting.model";

// Get Settings
const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await Setting.findOne();
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Settings retrieved successfully!",
    data: result || {},
  });
});

// Update/Create Settings
const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;


  const result = await Setting.findOneAndUpdate(
    {}, 
    payload, 
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Settings updated successfully!",
    data: result,
  });
});

export const SettingControllers = {
  getSettings,
  updateSettings,
};