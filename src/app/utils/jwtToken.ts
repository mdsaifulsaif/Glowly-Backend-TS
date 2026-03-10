// import { Response } from "express";
// import jwt from "jsonwebtoken";

// export const sendToken = (user: any, statusCode: number, res: Response) => {

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET!,
//     { expiresIn: "7d" },
//   );

//   const options = {
//     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "none" as const,
//     path: "/",
//   };

//   res
//     .status(statusCode)
//     .cookie("token", token, options)
//     .json({
//       success: true,
//       message:
//         statusCode === 201
//           ? "Registered Successfully"
//           : "Logged in Successfully",
//       data: {
//         user,
//         token,
//       },
//     });
// };

import { Response } from "express";
import jwt from "jsonwebtoken";

interface IUser {
  _id: string;
  role: string;
}

export const sendToken = (
  user: IUser,
  statusCode: number,
  res: Response,
): void => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
    path: "/",
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
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
