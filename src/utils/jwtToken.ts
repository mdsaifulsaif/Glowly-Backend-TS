import { Response } from "express";
import jwt from "jsonwebtoken";

export const sendToken = (user: any, statusCode: number, res: Response) => {

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const, 
    path: "/", 
  };

 
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message:
        statusCode === 201
          ? "Registered Successfully"
          : "Logged in Successfully",
      data: {
        user,
        token,
      },
    });
};
