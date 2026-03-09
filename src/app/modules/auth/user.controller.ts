// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { UserServices } from "./user.service";
// import { sendToken } from "../../utils/jwtToken";
// import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
// import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";

// // --- Register ---
// const registerUser = catchAsync(async (req: Request, res: Response) => {
//   const userExists = await UserServices.findUserByEmail(req.body.email);
//   if (userExists) {
//     return res.status(400).json({ success: false, message: "User already exists" });
//   }

//   const result = await UserServices.registerUserIntoDB(req.body);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "User registered successfully",
//     data: result,
//   });
// });

// // --- Login ---
// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Please enter email & password" });
//   }

//   const user = await UserServices.findUserByEmail(email, true);

//   // password match check with safety
//   if (!user || !(await bcrypt.compare(password, user.password || ""))) {
//     return res.status(401).json({ success: false, message: "Invalid email or password" });
//   }

//   const userResponse = {
//     _id: user._id,
//     email: user.email,
//     role: (user as any).role
//   };

//   sendToken(userResponse, 200, res);
// });

// // --- Logout ---
// const logoutUser = catchAsync(async (req: Request, res: Response) => {
//   res.cookie("token", null, {
//     expires: new Date(0),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "none",
//     path: "/",
//   });

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Logged Out Successfully",
//     data: null,
//   });
// });

// // --- Update Profile ---
// const updateProfile = catchAsync(async (req: Request, res: Response) => {
//   const userId = (req as any).user?._id;

//   const user = await UserServices.findUserById(userId);
//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   let updateData = { ...req.body };

//   if (req.file) {
//     const result: any = await uploadToCloudinary(req.file.buffer, "avatars");

//     if (user.avatar?.public_id) {
//       await deleteFromCloudinary(user.avatar.public_id);
//     }

//     updateData.avatar = {
//       public_id: result.public_id,
//       url: result.url
//     };
//   }

//   const result = await UserServices.updateProfileInDB(userId, updateData);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Profile updated successfully!",
//     data: result,
//   });
// });

// export const UserControllers = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   updateProfile,
// };

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { sendToken } from "../../utils/jwtToken";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";

// --- Register ---
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const userExists = await UserServices.findUserByEmail(req.body.email);

  if (userExists) {
    throw new Error("User already exists with this email!");
  }

  const result = await UserServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

// --- Login ---
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please enter both email and password");
  }

  const user = await UserServices.findUserByEmail(email, true);

  const isPasswordMatched =
    user && (await bcrypt.compare(password, user.password || ""));

  if (!user || !isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  const userResponse = {
    _id: user._id,
    email: user.email,
    role: (user as any).role,
  };

  sendToken(userResponse, 200, res);
});

// --- Logout ---
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.cookie("token", null, {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged Out Successfully",
    data: null,
  });
});

// --- Update Profile ---
const updateProfile = catchAsync(async (req: Request, res: Response) => {

  const userId = (req as any).user?._id;

  const user = await UserServices.findUserById(userId);
  if (!user) {
    throw new Error("User not found!");
  }

  let updateData = { ...req.body };

 
  if (req.file) {
  
    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

  
    const result: any = await uploadToCloudinary(req.file.buffer, "avatars");

    updateData.avatar = {
      public_id: result.public_id,
      url: result.secure_url || result.url,
    };
  }

  const result = await UserServices.updateProfileInDB(userId, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
};
