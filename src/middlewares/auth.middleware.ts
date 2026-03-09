
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import catchAsync from "../utils/catchAsync";

// --- Authenticated User Middleware ---
export const isAuthenticated = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  
    const { token } = req.cookies;


    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Login first to access this resource" 
        });
    }

 
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

 
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: "User not found with this token" 
        });
    }

    req.user = user;
    next();
});