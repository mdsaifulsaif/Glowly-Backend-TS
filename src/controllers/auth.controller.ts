import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { sendToken } from "../utils/jwtToken";
import sendResponse from "../utils/sendResponse";
import catchAsync from "../utils/catchAsync";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";

// --- Register User ---
export const registerUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({ firstName, lastName, email, password });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered",
    data: user,
  });
});

// --- Login User  ---
export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please enter email & password");
  }

  // ২. ইউজার খুঁজে বের করা (পাসওয়ার্ডসহ)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  // ৩. পাসওয়ার্ড চেক করা
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  // ৪. ক্লিন রেসপন্স ডাটা
  const userResponse = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  // ৫. টোকেন পাঠানো (sendToken এর ভেতর অলরেডি রেসপন্স লজিক আছে)
  sendToken(userResponse, 200, res);
});

// --- Logout User ---
export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged Out Successfully",
    data: null,
  });
});

// --- Update User Profile  ---


export const updateProfile = catchAsync(async (req: any, res: Response) => {
    const { firstName, lastName, phoneNumber } = req.body;
    let updateData: any = { firstName, lastName, phoneNumber };

   
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("User not found");

  
    if (req.file) {
    
        const result: any = await uploadToCloudinary(req.file.buffer, "avatars");

       
        if (user.avatar && user.avatar.public_id) {
            await deleteFromCloudinary(user.avatar.public_id);
        }

      
        updateData.avatar = {
            public_id: result.public_id,
            url: result.url
        };
    }

 
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id, 
        updateData, 
        { new: true, runValidators: true }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated and old image deleted!",
        data: updatedUser,
    });
});